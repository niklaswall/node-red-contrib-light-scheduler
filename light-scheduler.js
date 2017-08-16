module.exports = function(RED) {
  "use strict";
  var path = require('path');
  var req = require('request');
  var util = require('util');  
  var scheduler = require('./lib/scheduler.js');
  var isItDark = require('./lib/isitdark.js');

  var LightScheduler = function(n) {

    RED.nodes.createNode(this, n);
    this.settings = RED.nodes.getNode(n.settings); // Get global settings
    this.events = JSON.parse(n.events);
    this.topic = n.topic;
    this.onPayload = n.onPayload;
    this.onPayloadType = n.onPayloadType;
    this.offPayload = n.offPayload;
    this.offPayloadType = n.offPayloadType;
    this.onlyWhenDark = n.onlyWhenDark;
    this.override = 'auto';
    this.prevPayload = null;
    var node = this;


    function setState(out) {
      var msg = {
        topic: node.topic,
      };
      if(out)
        msg.payload = RED.util.evaluateNodeProperty(node.onPayload, node.onPayloadType, node, msg);
      else
        msg.payload = RED.util.evaluateNodeProperty(node.offPayload, node.offPayloadType, node, msg);

      var overrideTxt = node.override == 'auto'?'':' (Override: ' + node.override + ')';
      node.status({fill: out?"green":"red", shape: "dot", text: msg.payload + overrideTxt});

      // Only send anything if the state have changed.
      if(msg.payload !== node.prevPayload)
      {
        node.send(msg);
        node.prevPayload = msg.payload;
      }
    }


    function evaluate() {
      // Handle override state, if any.
      if(node.override == 'on')
        return setState(true);

      if(node.override == 'off')
        return setState(false);

      var matchEvent = scheduler.matchSchedule(node.events);

      if(node.override == 'schedule-only')
        return setState(matchEvent);

      if(node.override == 'light-only')
        return setState(isItDark(node));

      // node.override == auto
      if(!matchEvent)
        return setState(false);

      if(node.onlyWhenDark)
        return setState(isItDark(node));

      return setState(true);
    }


    node.on('input', function(msg) {
      if(msg.payload.match(/^(on|off|auto|schedule-only|light-only)$/i))
      {
        node.override = msg.payload.toLowerCase();;
        //console.log("Override: " + node.override);
      }
      else
        node.warn('Failed to interpret incomming msg.payload. Ignoring it!');

      evaluate();
    });

    // re-evaluate every minute
    node.evalInterval = setInterval(evaluate, 60000);

    // Run initially directly after start / deploy.
    setTimeout(evaluate, 1000);

    node.on('close', function() {
      clearInterval(node.evalInterval);
    });
	};


  RED.nodes.registerType("light-scheduler", LightScheduler);

  RED.httpAdmin.get('/light-scheduler/js/*', function(req,res) {
    var options = {
      root: __dirname + '/static/',
      dotfiles: 'deny'
    };
    res.sendFile(req.params[0], options);
  });
};
module.exports = function(RED) {
  "use strict";
  var path = require('path');
  var req = require('request');
  var util = require('util');
  var SunCalc = require('suncalc');

  var lightScheduler = function(n) {

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

    function isItDark() {
      if(!node.settings || !node.settings.latitude || !node.settings.longitude)
      {
        node.warn('Longitude and Latitude not configured properly, unable to take sun position into calculation!');
        return true;
      }

      var ts_yesterday = new Date();
      ts_yesterday.setDate(ts_yesterday.getDate()-1);
      var ts_now = new Date();
      var ts_tomorrow = new Date();
      ts_tomorrow.setDate(ts_tomorrow.getDate()+1);
      //console.log('Longitude: ', node.settings.longitude);
      //console.log('Latitude: ', node.settings.latitude);

      // Calculate sun times. 
      var yesterday = SunCalc.getTimes(ts_yesterday, node.settings.latitude, node.settings.longitude);
      var yesterday_down = yesterday.goldenHour;
      var today = SunCalc.getTimes(ts_now, node.settings.latitude, node.settings.longitude);
      var today_up = today.goldenHourEnd;
      var today_down = today.goldenHour;
      var tomorrow = SunCalc.getTimes(ts_tomorrow, node.settings.latitude, node.settings.longitude);
      var tomorrow_up = tomorrow.goldenHourEnd;

      var darkFrom = ts_now <= today_up ? yesterday_down : today_down;
      var darkUntil = ts_now <= today_up ? today_up : tomorrow_up;

      //node.log(util.format('Dark from %s to %s!', darkFrom, darkUntil));
      return (ts_now > darkFrom && ts_now <= darkUntil);
    }

    function evaluateSchedule() {
      // Handle override state, if any.
      if(node.override == 'on')
        return setState(true);

      if(node.override == 'off')
        return setState(false);

      var duringEvent = false;
      node.events.map((event) => {
        var now = new Date();

        var evtStart = new Date();
        evtStart.setTime(Date.parse(event.start));
        var evtEnd =  new Date();
        evtEnd.setTime(Date.parse(event.end));

        if(evtStart.getDay() == now.getDay()) {
          evtStart.setFullYear(now.getFullYear(),now.getMonth(), now.getDate());
          evtEnd.setFullYear(now.getFullYear(),now.getMonth(), now.getDate());

          //console.log("Now: ", now);
          //console.log("Start: ",evtStart);
          //console.log("End: ",evtEnd);
          if(now >= evtStart && now <= evtEnd) {
            duringEvent = true; // Set onEvent flag if we currently match a event.
            //console.log("MATCHED EVENT");
          }
        }
      });

      if(node.override == 'schedule-only')
        return setState(duringEvent);

      if(node.override == 'light-only')
        return setState(isItDark());

      // node.override == auto
      if(!duringEvent)
        return setState(false);

      if(node.onlyWhenDark)
        return setState(isItDark());

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

      evaluateSchedule();
    });

    // re-evaluate every minute
    node.evalInterval = setInterval(evaluateSchedule, 60000);

    // Run initially directly after start / deploy.
    setTimeout(evaluateSchedule, 1000);

    node.on('close', function() {
      clearInterval(node.evalInterval);
    });
	};

  RED.nodes.registerType("light-scheduler", lightScheduler);

  RED.httpAdmin.get('/light-scheduler/js/*', function(req,res) {
    var options = {
      root: __dirname + '/static/',
      dotfiles: 'deny'
    };
    res.sendFile(req.params[0], options);
  });
};
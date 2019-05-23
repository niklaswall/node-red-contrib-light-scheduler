module.exports = function(RED) {
  'use strict'
  var path = require('path')
  var req = require('request')
  var util = require('util')
  var scheduler = require('./lib/scheduler.js')
  var isItDark = require('./lib/isitdark.js')

  var LightSchedulerFilter = function(n) {
    RED.nodes.createNode(this, n)
    this.settings = RED.nodes.getNode(n.settings) // Get global settings
    this.events = JSON.parse(n.events)
    this.runningEvents = JSON.parse(n.events) // With possible randomness.
    this.onlyWhenDark = n.onlyWhenDark
    this.sunElevationThreshold = n.sunElevationThreshold ? n.sunElevationThreshold : 6
    this.sunShowElevationInStatus = n.sunShowElevationInStatus | false
    this.scheduleRndMax = !isNaN(parseInt(n.scheduleRndMax)) ? parseInt(n.scheduleRndMax) : 0
    this.scheduleRndMax = Math.max(Math.min(this.scheduleRndMax, 60), 0) // 0 -> 60 allowed
    this.state = false
    var node = this

    function isEqual(a, b) {
      // simpler and more what we want compared to RED.utils.compareObjects()
      return JSON.stringify(a) === JSON.stringify(b)
    }

    function randomizeSchedule() {
      function offsetMOD() {
        var min = 0 - node.scheduleRndMax
        var max = node.scheduleRndMax
        return Math.floor(Math.random() * (max - min) + min)
      }

      node.runningEvents = node.events.map(event => {
        var minutes = event.end.mod - event.start.mod

        // Prevent randomization of event that start and end at midnight to
        // prevent "gaps" when the schedule continuous past midnight.
        // TODO: Handle all events that is back-to-back after each other.
        if (event.start.mod !== 0) event.start.mod = event.start.mod + offsetMOD()

        if (event.end.mod !== 0) {
          event.end.mod = event.end.mod + offsetMOD()

          if (event.end.mod <= event.start.mod)
            // Handle "too short events"
            event.end.mod = event.start.mod + minutes // Events can overlap, but we don't need to care about that
        }

        return event
      })
    }

    function setState(out) {
      var sunElevation = ''
      if (node.sunShowElevationInStatus) {
        sunElevation = '  Sun: ' + isItDark.getElevation(node).toFixed(1) + '°'
      }

      node.status({
        fill: out ? 'green' : 'red',
        shape: 'dot',
        text: (out ? 'ON' : 'OFF') + sunElevation,
      })
      node.state = out
    }

    function evaluate() {
      var matchEvent = scheduler.matchSchedule(node)

      // node.override == auto
      if (!matchEvent) return setState(false)

      if (node.onlyWhenDark) return setState(isItDark.isItDark(node))

      return setState(true)
    }

    node.on('input', function(msg) {
      // Evaluate before forwarding msg, so that we always forward to the right one.
      evaluate()
      if (node.state) node.send([msg, null])
      else node.send([null, msg])
    })

    // Run initially directly after start / deploy.
    evaluate()

    // re-evaluate every minute to show the correct status on the node
    node.evalInterval = setInterval(evaluate, 60000)

    node.on('close', function() {
      clearInterval(node.evalInterval)
      clearInterval(node.rndInterval)
    })

    if (node.scheduleRndMax > 0) {
      randomizeSchedule()
      // Randomize schedule every hour for now, could cause problems with large scheduleRndMax.
      node.rndInterval = setInterval(randomizeSchedule, 1 * 60 * 60 * 1000)
    }
  }

  RED.nodes.registerType('light-scheduler-filter', LightSchedulerFilter)

  RED.httpAdmin.get('/light-scheduler/js/*', function(req, res) {
    var options = {
      root: __dirname + '/static/',
      dotfiles: 'deny',
    }
    res.sendFile(req.params[0], options)
  })
}

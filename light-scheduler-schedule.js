module.exports = function(RED) {
    function LightSchedulerSchedule(n) {
      RED.nodes.createNode(this, n);
      this.name = n.name;
      this.test = n.test;
      this.onlyWhenDark = n.onlyWhenDark;
      this.sunElevationThreshold = n.sunElevationThreshold ? n.sunElevationThreshold : 6;
      this.events = JSON.parse(n.events);
      this.runningEvents = JSON.parse(n.events); // With possible randomness.
      this.scheduleRndMax = !isNaN(parseInt(n.scheduleRndMax)) ? parseInt(n.scheduleRndMax) : 0;
}
    RED.nodes.registerType("light-scheduler-schedule", LightSchedulerSchedule);

    RED.httpAdmin.get('/light-scheduler/js/*', function(req, res) {
      var options = {
        root: __dirname + '/static/',
        dotfiles: 'deny',
      }
      res.sendFile(req.params[0], options)
    })
    
  }
  
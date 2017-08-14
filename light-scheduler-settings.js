module.exports = function(RED) {
  function LightSchedulerSettings(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.latitude = n.latitude;
    this.longitude = n.longitude;
  }
  RED.nodes.registerType("light-scheduler-settings", LightSchedulerSettings);
}

var util = require('util');
var SunCalc = require('suncalc');

module.exports = function (node) {
  if(!node.settings || !node.settings.latitude || !node.settings.longitude)
  {
    node.warn('Longitude and Latitude not configured properly, unable to take sun position into calculation!');
    return true;
  }

  var ts_now = new Date();
  var sunPos = SunCalc.getPosition(ts_now, node.settings.latitude, node.settings.longitude);
  //console.log(JSON.stringify(sunPos));
  return sunPos.altitude < 0.0;
};

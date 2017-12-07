var util = require('util');
var SunCalc = require('suncalc');

module.exports = function (node) {
  if(!node.settings || !node.settings.latitude || !node.settings.longitude)
  {
    node.warn('Longitude and Latitude not configured properly, unable to take sun position into calculation!');
    return true;
  }

  var th = node.sunElevationThreshold ? node.sunElevationThreshold : 6;

  var ts_now = new Date();
  var sunPos = SunCalc.getPosition(ts_now, node.settings.latitude, node.settings.longitude);
  var sunDeg = sunPos.altitude * 180 / Math.PI
  //node.log('sun altitude: ' + sunDeg + ' - Threshold: ' + th);
  return sunDeg < th;
};

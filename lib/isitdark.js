var SunCalc = require('suncalc');

module.exports = function (node) {
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
};
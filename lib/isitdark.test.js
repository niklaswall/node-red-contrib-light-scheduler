var isitdark = require('./isitdark.js');
var tk = require('timekeeper');

// Global mock for node
var node = {};
node.warn = function() {

};

test('Dark when no position is configured.', () => {
  var result = isitdark(node);
  expect(result).toBe(true);
});

test('Sweden 21/8 2017', () => {
  node.settings = {latitude: 59.3322189, longitude: 18.0631894};

  var time = new Date(1503309600000); // Monday, August 21, 2017 12:00:00 PM GMT+02:00
  tk.freeze(time);  
  var result = isitdark(node);
  expect(result).toBe(false);

  var time = new Date(1503342000000); // Monday, August 21, 2017 9:00:00 PM GMT+02:00
  tk.freeze(time);  
  var result = isitdark(node);
  expect(result).toBe(true);

  tk.reset();
});

test('Sweden 24/12 2017', () => {
  node.settings = {latitude: 59.3322189, longitude: 18.0631894};

  var time = new Date(1514113200000); // Sunday, December 24, 2017 12:00:00 PM GMT+01:00
  tk.freeze(time);  
  var result = isitdark(node);
  expect(result).toBe(false);

  var time = new Date(1514124000000); // Sunday, December 24, 2017 3:00:00 PM GMT+01:00
  tk.freeze(time);  
  var result = isitdark(node);
  expect(result).toBe(true);

  tk.reset();  
});

test('Sweden 01/12 2017', () => {
  node.settings = {latitude: 63.2806334, longitude: 18.7371558}; // Ornskoldsvik!

  var time = new Date(1512110924000); // fredag 1 december 2017 kl. 07:48:44 GMT+01:00
  tk.freeze(time);  
  var result = isitdark(node);
  expect(result).toBe(true);

  var time = new Date(1512126000000); // fredag 1 december 2017 kl. 12:00:00 GMT+01:00
  tk.freeze(time);  
  var result = isitdark(node);
  expect(result).toBe(false);

  tk.reset();  
});


test('24h night in Kiruna', () => {
  node.settings = {latitude: 67.8636816, longitude: 20.1893403}; // Kiruna

  var ts = 1514070000000;
  while (ts <= 1514156400000)
  {
    var time = new Date(ts);  
    tk.freeze(time);  

    expect(isitdark(node)).toBe(true);

    ts = ts + 1*60*1000; // Check even minutes
  }

  tk.reset();  
});

test('24h day in Kiruna', () => {
  node.settings = {latitude: 67.8636816, longitude: 20.1893403}; // Kiruna

  var ts = 1498860000000;
  while (ts <= 1498946399000)
  {
    var time = new Date(ts);  
    tk.freeze(time);  

    expect(isitdark(node)).toBe(false);

    ts = ts + 1*60*1000; // Check even minutes
  }

  tk.reset();  
});

var scheduler = require('./scheduler.js');
var tk = require('timekeeper');

// Global mock for node
var node = {};
node.warn = function() {

};

test('Missing configuration', () => {  
  expect(scheduler.matchSchedule(node)).toBe(true);
});

test('Empty configuration', () => {  
  node.events = [];
  expect(scheduler.matchSchedule(node)).toBe(false);
});

test('Old configuration', () => {  
  node.events = [
    {start: "2018-01-01T16:00:00.000Z", end: "2018-01-01T17:00:00.000Z", title: "", id: 0},
    {start: "2018-01-02T16:00:00.000Z", end: "2018-01-02T17:00:00.000Z", title: "", id: 1},
    {start: "2018-01-03T16:00:00.000Z", end: "2018-01-03T17:00:00.000Z", title: "", id: 2},
    {start: "2018-01-04T16:00:00.000Z", end: "2018-01-04T17:00:00.000Z", title: "", id: 3},
    {start: "2018-01-05T16:00:00.000Z", end: "2018-01-05T17:00:00.000Z", title: "", id: 4},
    {start: "2018-01-06T16:00:00.000Z", end: "2018-01-06T17:00:00.000Z", title: "", id: 4},
    {start: "2018-01-07T16:00:00.000Z", end: "2018-01-07T17:00:00.000Z", title: "", id: 4},
  ];
  expect(scheduler.matchSchedule(node)).toBe(false);
});


test('Sunday', () => {
  node.events = [
    {start: {dow: 0, mod: 0}, end: {dow: 1, mod: 0}}
  ];

  var ts = 1503698400000;  // Friday, August 25, 2017 10:00:00 PM
  while (ts <= 1503914400000) // Monday, August 28, 2017 10:00:00 AM
  {
    var time = new Date(ts);  
    tk.freeze(time);  
    var result = scheduler.matchSchedule(node);
    var correct = time.getDay() == 0;
    expect(result).toBe(correct);
    ts = ts + 1*60*1000; // Check even minutes
  }

  tk.reset();
});

test('Monday', () => {
  node.events = [
    {start: {dow: 1, mod: 0}, end: {dow: 2, mod: 0}}
  ];

  var ts = 1503230400000;  // Sunday, August 20, 2017 12:00:00 PM
  while (ts <= 1503403200000) // Tuesday, August 22, 2017 12:00:00 PM
  {
    var time = new Date(ts);  
    tk.freeze(time);  
    var result = scheduler.matchSchedule(node);
    var correct = time.getDay() == 1;
    expect(result).toBe(correct);
    ts = ts + 1*60*1000; // Check even minutes
  }

  tk.reset();
});

test("ON 24/7", () => {

  node.events = [
    {start: {dow: 1, mod: 0}, end: {dow: 2, mod: 0}},
    {start: {dow: 2, mod: 0}, end: {dow: 3, mod: 0}},
    {start: {dow: 3, mod: 0}, end: {dow: 4, mod: 0}},
    {start: {dow: 4, mod: 0}, end: {dow: 5, mod: 0}},
    {start: {dow: 5, mod: 0}, end: {dow: 6, mod: 0}},
    {start: {dow: 6, mod: 0}, end: {dow: 0, mod: 0}},
    {start: {dow: 0, mod: 0}, end: {dow: 1, mod: 0}} ];

  var ts = 1503230400000;  // Sunday, August 20, 2017 12:00:00 PM
  while (ts <= 1503914400000) // Monday, August 28, 2017 10:00:00 AM
  {
    var time = new Date(ts);  
    tk.freeze(time);  
    var result = scheduler.matchSchedule(node);
    expect(result).toBe(true);
    ts = ts + 15*60*1000; // Check even minutes
  }
  tk.reset();
});

test("OFF 24/7", () => {  
    node.events = [];      
    var ts = 1503230400000;  // Sunday, August 20, 2017 12:00:00 PM
    while (ts <= 1503914400000) // Monday, August 28, 2017 10:00:00 AM
    {
      var time = new Date(ts);  
      tk.freeze(time);  
      var result = scheduler.matchSchedule(node);
      expect(result).toBe(false);
      ts = ts + 1*60*1000; // Check even minutes
    }
    tk.reset();
  });
  
test('Lunch hour, Wednesday', () => {
  node.events = [
    {start: {dow: 3, mod: 720}, end: {dow: 3, mod: 780}} // 12:00 - 13:00 Wednesday 
  ];

  var ts = 1503871200000;  // Sunday, August 27, 2017 10:00:00 PM
  while (ts <= 1504476000000) // Sunday, September 3, 2017 10:00:00 PM
  {
    var time = new Date(ts);  
    tk.freeze(time);  
    var result = scheduler.matchSchedule(node);
    var correct = ((ts) >= 1504087200000 && (ts) <= 1504090800000);
    expect(result).toBe(correct);
    ts = ts + 1*60*1000; // Check even minutes
  }

  tk.reset();
});

test('NaN', () => {
  node.events = [
    {start: {dow: 'this', mod: 'will'}, end: {dow: 'not', mod: 'work'}}
  ];

  var ts = 1503871200000;  // Sunday, August 27, 2017 10:00:00 PM
  var time = new Date(ts);  
  tk.freeze(time);  
  var result = scheduler.matchSchedule(node);
  expect(result).toBeNull;

  tk.reset();
});



module.exports = {
  matchSchedule: function(events) {
    var matchingEvent = false;
    var now = new Date();
    events.map((event) => {

      function adjustDate(d) {
        d = new Date(Date.parse(d));
        
        var targetDOW = d.getDate(); // Monday == 1 (Since all dates stored are starting 2018-01-01)
        var h = d.getUTCHours();
        var m = d.getUTCMinutes();

        var year = now.getFullYear();
        var month = now.getMonth();
        var dow = now.getDay();    
        var dayDiff = dow-targetDOW;
        var date = now.getUTCDate()+dayDiff;
        return new Date(year, month, date, h, m, 0, 0);
      };

      var evtStart = adjustDate(event.start);
      var evtEnd = adjustDate(event.end);

      if(now >= evtStart && now <= evtEnd) {
        matchingEvent = true;
      }
    });
    return matchingEvent; // dit not match any of the evetns
  } 
}

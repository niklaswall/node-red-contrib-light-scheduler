module.exports = {
  matchSchedule: function(events) {
    var matchingEvent = false;
    var now = new Date();
    events.map((event) => {

      function parseDate(o, end) {
        o.dow = parseInt(o.dow);
        o.mod = parseInt(o.mod);
        if(o.dow == 'NaN' || o.mod == 'NaN')
          return null;

        var hours = Math.floor(o.mod / 60);
        var minutes = o.mod - (hours*60);

        var year = now.getFullYear();
        var month = now.getMonth();
        var dow = now.getDay();            
        var dayDiff = o.dow >= dow ? o.dow - dow : 7 - dow + o.dow;
        var date = now.getUTCDate()+dayDiff;
        return new Date(year, month, date, hours, minutes, 0, 0);
      };

      var evtStart = parseDate(event.start);
      var evtEnd = parseDate(event.end);

      if(evtStart == null || evtEnd == null)
        return;

      if(now >= evtStart && now <= evtEnd) {
        matchingEvent = true;
      }
    });
    return matchingEvent;
  } 
}

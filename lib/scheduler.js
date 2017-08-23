module.exports = {
  matchSchedule: function(node) {
    var events = node.events;
    if(!Array.isArray(events))
    {
      node.warn('Incompatible event configuration!')
      return true;
    }
    var matchingEvent = false;
    var now = new Date();
    events.map((event) => {

      function parseDate(o, end) {
        o.dow = parseInt(o.dow);
        o.mod = parseInt(o.mod);
        if(isNaN(o.dow) || isNaN(o.mod))
          return null;

        var hours = Math.floor(o.mod / 60);
        var minutes = o.mod - (hours*60);

        var year = now.getFullYear();
        var month = now.getMonth();
        var dow = now.getDay();            
        var dayDiff = o.dow >= dow ? o.dow - dow : o.dow - dow;
        var date = now.getDate()+dayDiff;
        return new Date(year, month, date, hours, minutes, 0, 0);
      };

      var evtStart = parseDate(event.start);
      var evtEnd = parseDate(event.end);

      if(evtStart == null || evtEnd == null)
        return null;

      if(now.getTime() >= evtStart.getTime() && now.getTime() <= evtEnd.getTime()) {
        matchingEvent = true;
      }
    });
    return matchingEvent;
  } 
}

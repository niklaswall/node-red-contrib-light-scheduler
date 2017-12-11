module.exports = {
  matchSchedule: function(node) {
    var events = node.runningEvents || node.events;
    if(!Array.isArray(events))
    {
      node.warn('Incompatible event configuration!')
      return true;
    }
    var matchingEvent = false;
    var now = new Date();
    //console.log('Checking: ', now.toString(), now.getDay());
    events.forEach((event) => {

      function parseDate(et) {
        et.dow = parseInt(et.dow);
        et.mod = parseInt(et.mod);
        if(isNaN(et.dow) || isNaN(et.mod))
          return null;

        var hours = Math.floor(et.mod / 60);
        var minutes = et.mod - (hours*60);

        var year = now.getFullYear();
        var month = now.getMonth();
        var dow = now.getDay();            
        
        // Event DOW is before "today", move it forward in time
        var etdow = et.dow < dow ? dow + et.dow + 1 : et.dow;
        var dayDiff = etdow - dow;

        var date = now.getDate()+dayDiff;
        return new Date(year, month, date, hours, minutes, 0, 0);
      };

      var evtStart = parseDate(event.start);
      var evtEnd = parseDate(event.end);      

      if(evtStart == null || evtEnd == null)
        return null;

      // Adjust evtEnd for events stopping at midninght "today"
      if(evtStart.getTime() > evtEnd.getTime()) {  
        evtEnd.setDate(evtEnd.getDate() + 7);
      }

      if(now.getTime() >= evtStart.getTime() && now.getTime() <= evtEnd.getTime()) {
        matchingEvent = true;
      }
    });
    return matchingEvent;
  } 
}

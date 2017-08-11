# Light Scheduler
## node-red-contrib-light-scheduler

Light Scheduler is a node-red node that provides a weekly schedule, and is mainly focused on controlling light in home automation scenarios.

#### Main features
* Graphical week-based schedule editor.
* Control light based on dusk/sunset dawn/sunrise (only turn on lights when it's dark).
* Customizable on/off payloads (and topic).


#### Planned features
- [ ] Override state based on input (on, off, auto etc).
- [ ] Date-based schedule exceptions (for holidays etc).
- [ ] Lux-based control (instead of sun-position based).
- [ ] meta-data output (JSON data with information about current state and next change).

##### Credits

This node is initially based on tyrrellsystems's [node-red-contrib-simple-weekly-scheduler](https://github.com/tyrrellsystems/node-red-contrib-simple-weekly-scheduler) node and [jQuery.weekCalendar](http://wiki.github.com/themouette/jquery-week-calendar/), and is using [SunCalc](https://github.com/mourner/suncalc) for sun position calculations.
# Light Scheduler
## node-red-contrib-light-scheduler

Light Scheduler is a node-red node that provides a weekly schedule, and is mainly focused on controlling light in home automation scenarios.

#### Main features
* Graphical week-based schedule editor.
* Control light based on dusk/sunset dawn/sunrise (only turn on lights when it's dark).
* Customizable on/off payloads (and topic).
* Override functionality.

##### Overrides
The automatic state of the Light Scheduler can be overridden by injecting a string in msg.payload. 
![Overrides](https://github.com/niklaswall/node-red-contrib-light-scheduler/raw/master/screenshots/override.png "Overrides")

msg.payload can be either 'on', 'off', 'schedule-only', 'light-only' or 'auto'. Auto will remove the override and make the light scheduler work as normal. Schedule Only will ignore the light level and control the output only according to the schedule. Light Only will ignore the schedule and only care about the light level.

The override functionality could for example be used to force lights to turn on when there is motion/precense detected as long as it's dark.


#### Planned features / changes
- [x] Override state based on input (on, off, auto etc).
- [ ] Date-based schedule exceptions (for holidays etc).
- [ ] Lux-based control (instead of sun-position based).
- [ ] meta-data output (JSON data with information about current state and next change).
- [ ] new better graphical schedule editor.


#### Known Issues
* The schedule is evaluated incorrect if ending exacly at midninght.
* The schedule editor is lagging when resizing an event.
* There seem to be some incompatibility with the Safari browser.

#### Changelog

##### v0.0.4. (August 13, 2017)
* Added override functionality.

##### v0.0.3.
* Added "Only when dark" setting. If checked the On payload will only be sent when the schedule matches and it is dark.
* Fixed some typos which prevented the "Only when dark" setting from working correctly.

##### v0.0.2.
* Fixed some missing dependencies.

##### v0.0.1
* Initial version

##### Credits

This node is initially based on tyrrellsystems's [node-red-contrib-simple-weekly-scheduler](https://github.com/tyrrellsystems/node-red-contrib-simple-weekly-scheduler) node and [jQuery.weekCalendar](http://wiki.github.com/themouette/jquery-week-calendar/), and is using [SunCalc](https://github.com/mourner/suncalc) for sun position calculations.

# Light Scheduler
node-red-contrib-light-scheduler


Light Scheduler is a node-red node that provides a weekly schedule, and is mainly focused on controlling light in home automation scenarios but could be used to control anything in your node-red setup.

*PLEASE NOTE:* This node is still in "heavy" development and might not behave as you would expect (but should). Please don't hesitate to register an issue at [github](https://github.com/niklaswall/node-red-contrib-light-scheduler/issues) for potential fault (and improvements suggestions)!

## Main features

### Graphical Schedule Editor

The graphical scheduler makes it quick and easy to define when you want your output to turn on / off.
The schedule is on a weekly basis, so each week day can be individually defined.

![Editor](https://raw.githubusercontent.com/niklaswall/node-red-contrib-light-scheduler/master/screenshots/editor.png "Editor")


### Dusk / Dawn overrides

To save energy it's nice to be able to only have the lamps and other functions only turn on / off when it bright / dark outside.
The Light Scheduler default is to calculate the sun's position for the given position (latitude / longitude) and make sure that the output is only triggered to on / off based on both the schedule and "it it's dark" outside. The sune elevation threshold can be used to control how early / late this setting will have effect.


### Overrides

The automatic state of the Light Scheduler can be overridden by injecting a string in msg.payload. 
![Overrides](https://github.com/niklaswall/node-red-contrib-light-scheduler/raw/master/screenshots/override.png "Overrides")

msg.payload can be either 'on', 'off', 'schedule-only', 'light-only' or 'auto'. **Auto** will remove the override and make the light scheduler work as normal. **Schedule Only** will ignore the light level and control the output only according to the schedule. **Light Only** will ignore the schedule and only care about the light level.

The override functionality could for example be used to force lights to turn on when motion is detected, but with the condition that it's dark.

![Motion Override](https://raw.githubusercontent.com/niklaswall/node-red-contrib-light-scheduler/master/screenshots/motion_override.png "Motion Override")


### Customizable on/off payloads (and topic).

Since this node don't forward any input msg to the output, the payloads for both the on state and the off state must be defined. It's also possible to define the topic (if needed).

### Controlled output

The Light Scheduler have three modes that control how and when a message will be sent:
* "**when state changes**" - Will only output a message when the state changes. The state is evaluated on a minutely basis, so it can take up to a minute after deploy of a new configu before the output it triggered.
* "**when state changes + startup**" - Will only output a message when the state changes and directly after a deploy and a restart of node-red.
* "**minutely**" - Will only output a msg on a minutely basis even if the state have not changed.


## Planned features / changes
- [ ] Date-based schedule exceptions (for holidays etc).
- [ ] Lux-based control (instead of sun-position based).
- [ ] meta-data output (JSON data with information about current state and next change).


## Changelog

### v0.0.11 (December 7, 2017)
* Added a sun elevation threshold to the dusk/dawn section. It's now possible to adjust how early / late the sun position should affect the output. Sun elevation over the horizon is used instead of a time-offset, this will cater for a more consistant result over the year as the sun trajectory changes over time. (Fixes issue #3)
* Added drag-and drop. Thank you @erikalveflo!
* Fixed problem with schedules ending at sunday midnight (Issue #6). Thank you @erikalveflo!
* Added setting for showing the Sun elevation in the Node Status.

### v0.0.10 (December 5, 2017)
* Improved code that calculates "if it is dark" based on sun position.

### v0.0.9 (September 1, 2017)
* Fixed payload type fault. The type did not get saved correctly.
* Changed dusk / dawn edit control to be more clear.
* Added setting that controls when the node send out a message.

### v0.0.8 (August 30, 2017)
* Improved unit tests.
* Fixed fault that caused event that ended Saturnday at midningt (Sunday 00:00) to be faulty interpreted.
* Changed Node status message to not show payload.
* Global configuration node now gets the latitude and longitude from the browser (if awailable).

### v0.0.7 (August 22, 2017)
* Jest Unit tests.
* Quality improvements and bug fixes.

### v0.0.6  (August 21, 2017)
* Mainly documentation updates.

### v0.0.5. (August 21, 2017)
* New storage format for schedules. (Unfortunately means that old schedules are lost and must be added again).
* New graphical schedule editor (should work better for all browsers).
* Started to prepare for unit-tests.

### v0.0.4. (August 13, 2017)
* Added override functionality.

### v0.0.3.
* Added "Only when dark" setting. If checked the On payload will only be sent when the schedule matches and it is dark.
* Fixed some typos which prevented the "Only when dark" setting from working correctly.

### v0.0.2.
* Fixed some missing dependencies.

### v0.0.1
* Initial version


## Credits

This node was initially based on tyrrellsystems's [node-red-contrib-simple-weekly-scheduler](https://github.com/tyrrellsystems/node-red-contrib-simple-weekly-scheduler) but has evolved to now be more or less totally rewritten. It uses [fullcalendar.io](https://fullcalendar.io/) as a graphical editor for the schedule, and is using [SunCalc](https://github.com/mourner/suncalc) for sun position calculations.

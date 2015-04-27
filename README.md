m4l_js2liveAPI
==============

*Contains:*

- commonly used functions to interface with Ableton Live javascript api for use within max for live
- node.js TCP server to facilitate message passing between Cinder and Max/MSP (or any TCP client)

*Dependencies*

- Max/MSP 6 or 7 + Max for Live
- node.js v0.12.2

*Build Instructions*

- add script folder to Max File Preferences
- global_m4l.js: send "compile" message to a js object pointing to this file and you can call its functions from anywhere in your Live project
- to run TCP server: node start <path to .js file location>/tcp_server

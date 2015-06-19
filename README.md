# EventHandler.js
![Bower version](https://img.shields.io/bower/v/EventHandler.js.svg)
[![npm version](https://img.shields.io/npm/v/eventhandler.js.svg)](https://www.npmjs.com/package/eventhandler.js)
[![Build Status](https://travis-ci.org/murrayju/EventHandler.js.svg?branch=master)](https://travis-ci.org/murrayju/EventHandler.js)
[![Coverage Status](https://coveralls.io/repos/murrayju/EventHandler.js/badge.svg)](https://coveralls.io/r/murrayju/EventHandler.js)
[![devDependency Status](https://img.shields.io/david/dev/murrayju/EventHandler.js.svg)](https://david-dm.org/murrayju/EventHandler.js#info=devDependencies)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/EventHandler.svg)](https://saucelabs.com/u/EventHandler)

A simple class for handling events

## Quick start

Several options are available to get started:

- [Download the latest release](https://github.com/murrayju/EventHandler.js/releases/download/v0.1.1/eventhandler.js-0.1.1.33.HEAD.c219b8d8cd2d.zip).
- Clone the repo: `git clone https://github.com/murrayju/EventHandler.js.git`.
- Install with [Bower](http://bower.io): `bower install EventHandler.js`.
- Install with [npm](https://www.npmjs.com): `npm install eventhandler.js`.

## Example

```js
var evt = new EventHandler();

// Register a listener for this event
var handler = evt.on(function (someArg) {
  console.log('Event fired with arg: ' + someArg);
});

// Fire the event
evt.fire('test data');

// Unregister the listener when no longer needed
handler.off();
```

#### Credits
<a href="https://www.browserstack.com/automate/"><img alt="BrowserStack" src="http://www.xml2selenium.com/wp-content/uploads/2014/01/BrowserStackLogo.png" height="30px"/></a><br/>
A big thanks to BrowserStack for providing automated cross-browser testing!

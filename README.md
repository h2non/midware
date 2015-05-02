# midware [![Build Status](https://travis-ci.org/h2non/midware.svg?branch=master)](https://travis-ci.org/h2non/midware)

midware is a utility for creating middleware with any node or browser application. 
Inspired by the middleware pattern by [connect](https://github.com/senchalabs/connect).

### Example

```js
var use = require('midware')();
var message = {};

use(function(msg, next) {
  // msg === message
  next();
});

use.run(message, function(err) {
  if (err) return console.log(err);
  // finished
});
```

## Installation

### Node

To install mware in a Node application use npm.

```
npm install midware
```

### Browser

```
bower install midware
```

```
component install h2non/midware
```

```
<script src="cdn.rawgit.com/h2non/midware/0.1.0/midware.js"></script>
```

## Test

To run tests use npm.

```
$ npm install
$ npm test
```

## Documentation

### Basic Usage

Middleware is useful for creating a plugin system or configuring anything within an application. To use mware just require it and make a call to the module.

```js
var mware = require('mware');
var use = mware();
```

This will return a `use` function which when passed a callback will add it a waterfall sequence that will be invoked one after the other whenever the middleware is run.

```js
use(function(next) {
  // mad science here
  next();
});
```

Callbacks are given a `next` function which will **always** be the *last* argument. Calling `next` will tell the middleware to call the next callback in the use sequence or will complete its run. To run the callback sequence call the method `run` on the `use` function.

```js
use.run(function(err) {
  if (err) { return console.log(err); }
  // all done professor
});
```

`run` takes any amount of parameters that the callbacks will passed whenever run.

```js
use(function(first, last, next) {
  console.log('Hello %s, %s', first, last);
  next();
});
use.run('Christopher', 'Turner');
```

### Stopping

Whenever a callback should throw an exception or wish to stop the middleware from running any more calls. Give `next` an error or explicitly tell it stop.

```js
use(function(next) {
  next(new Error()); // stops middleware and gives error
  next(null, true); // tells middleware to stop
});
```

### Apply Context

Instead of binding context to callbacks, send the context to `mware`.

```js
var context = {};
var use = mware(context);
use(function(next) {
  // this === context
  next();
});
use.run(function(err) {
  // this === context
});
```

## API

#### mware(*[context]*)
#### use(*&lt;callback...&gt;*)
#### use.run(*[args...]*, *[done]*)

## License

[MIT](LICENSE)

Copyright (c) 2014 [Christopher Turner](https://github.com/tur-nr)
Copyright (c) 2015 [Tomas Aparicio](https://github.com/h2non)

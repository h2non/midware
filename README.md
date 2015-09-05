# midware [![Build Status](https://travis-ci.org/h2non/midware.svg?branch=master)](https://travis-ci.org/h2non/midware)

**midware** is a **tiny module** to **createsimple middleware** layers for any node.js or browser application. 
Inspired in the middleware pattern by [connect](https://github.com/senchalabs/connect).

It's only ~80 SLOC.

### Example

```js
var use = require('midware')()
var message = {}

use(function(msg, next) {
  // msg === message
  next()
})

use.run(message, function(err) {
  if (err) return console.log(err)
  // finished
})
```

## Installation

### Node

To install midware in a Node application use npm.

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
<script src="//cdn.rawgit.com/h2non/midware/0.1.4/midware.js"></script>
```

## Test

To run tests use npm.

```
$ npm install
$ npm test
```

## Documentation

### Basic Usage

Middleware is useful for creating a plugin system or configuring anything within an application. To use midware just require it and make a call to the module.

```js
var midware = require('midware')
var use = midware()
```

This will return a `use` function which when passed a callback will add it a waterfall sequence that will be invoked one after the other whenever the middleware is run.

```js
use(function(next) {
  // mad science here
  next()
})
```

Callbacks are given a `next` function which will **always** be the *last* argument. Calling `next` will tell the middleware to call the next callback in the use sequence or will complete its run. To run the callback sequence call the method `run` on the `use` function.

```js
use.run(function(err) {
  if (err) { return console.log(err) }
  // all done professor
})
```

`run` takes any amount of parameters that the callbacks will passed whenever run.

```js
use(function(first, last, next) {
  console.log('Hello %s, %s', first, last)
  next()
})
use.run('Christopher', 'Turner')
```

### Stopping

Whenever a callback should throw an exception or wish to stop the middleware from running any more calls. Give `next` an error or explicitly tell it stop.

```js
use(function(next) {
  next(new Error()) // stops middleware and gives error
  next(null, true) // tells middleware to stop
})

use.run(function (err, ended) {
  // ...
})
```

### Apply Context

Instead of binding context to callbacks, send the context to `midware`.

```js
var context = {}
var use = midware(context)
use(function(next) {
  // this === context
  next()
})
use.run(function(err) {
  // this === context
})
```

### Removing a function

You can remove registered functions in the middleware via its function name or function reference

```js
var use = midware()
use(function test(next) {
  next()
})
use.remove('test') // by function name
```

```js
var use = midware()
function test(next) {
  next()
}
use(test)
use.remove(test) // by function reference
```

## API

#### midware(*[context]*)
#### use(**callback...**)
#### use.remove(name|function)
#### use.run(*[args...]*, *[done]*)
#### use.stack = [ function... ]

## License

[MIT](LICENSE)

Copyright (c) 2014 [Christopher Turner](https://github.com/tur-nr)
Copyright (c) 2015 [Tomas Aparicio](https://github.com/h2non)

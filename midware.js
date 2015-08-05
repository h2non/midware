(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory)
  } else if (typeof exports === 'object') {
    factory(exports)
    if (typeof module === 'object' && module !== null) {
      module.exports = exports = exports.midware
    }
  } else {
    factory(root)
  }
}(this, function (exports) {
  'use strict'

  var slice = Array.prototype.slice
  midware.VERSION = '0.1.4'

  function midware(ctx) {
    var calls = use.stack = []
    ctx = ctx || null
       
    function use() {
      var args = toArray(arguments)

      args.forEach(function (fn) {
        if (typeof fn === 'function') {
          calls.push(fn)
        }
      })

      return ctx
    }

    use.run = function run() {
      var done, args = toArray(arguments)
      
      if (typeof args[args.length - 1] === 'function') {
        done = args.pop()
      }
      
      if (!calls.length) {
        if (done) done.call(ctx)
        return
      }
      
      var stack = calls.slice()
      args.push(next)
      
      function exec() {
        var fn = stack.shift()
        try {
          fn.apply(ctx, args)
        } catch (e) {
          next(e)
        }
      }

      function next(err, end) {
        if (err || end || !stack.length) {
          stack = null
          if (done) { done.call(ctx, err, end) }
          return
        }
        exec()
      }

      exec()
    }

    use.remove = function (name) {
      for (var i = 0, l = calls.length; i < l; i += 1) {
        var fn = calls[i]
        if (fn === name || fn.name === name) {
          calls.splice(i, 1)
          break
        }
      }
    }

    return use
  }

  function toArray(nargs) {
    var args = new Array(nargs.length)
    for (var i = 0, l = args.length; i < l; i += 1) {
      args[i] = nargs[i]
    }
    return args
  }

  exports.midware = midware
}))

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

  function midware(ctx) {
    var calls = []
    ctx = ctx || null
       
    function use() {
      var args = slice.call(arguments)

      args.filter(function (fn) {
        return typeof fn === 'function'
      })
      .forEach(function (fn) {
        calls.push(fn)
      })

      return ctx
    }

    use.run = function run() {
      var done
      var args = slice.call(arguments)
      var stack = calls.slice()

      if (typeof args[args.length - 1] === 'function') {
        done = args.pop()
      }

      if (!stack.length) {
        if (done) done.call(ctx)
        return
      }

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
          if (done) { done.call(ctx, err) }
          return
        }
        exec()
      }

      exec()
    }

    return use
  }

  exports.midware = midware
}))

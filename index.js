var slice = [].slice

module.exports = midware

function midware(ctx) {
  if (!ctx) { ctx = null }

  return (function() {
    var calls = []

    function use() {
      var args = slice.call(arguments)

      while (args.length) {
        var call = args.shift()

        if (Array.isArray(call)) {
          use.apply(this, call)
          continue
        }

        if (typeof call !== 'function') {
          throw new TypeError('First argument must be a function')
        }

        calls.push(call)
      }

      return context
    }

    use.run = function run() {
      var args = slice.call(arguments)
      var stack = calls.slice()
      var done

      if (typeof args[args.length - 1] === 'function')) {
        done = args.pop()
      }

      if (!stack.length) {
        if (done) { done.call(context) }
        return
      }

      args.push(next)

      function exec() {
        stack.shift().apply(context, args)
      }

      function next(err, fin) {
        if (err || fin || !stack.length) {
          stack = null
          if (done) { done.call(context, err) }
          return
        }
        
        exec()
      }

      exec()
    }

    return use
  }())
}

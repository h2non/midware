var midware = require('../')
var assert = require('assert')

describe('midware', function() {
  describe('#use()', function() {
    it('should add middleware', function(done) {
      var use = midware()

      assert.equal(typeof use, 'function', 'use is a function')

      use(function(next) {
        assert.equal(typeof next, 'function')
        done()
      })
      use.run()
    })

    it('should add with args', function(done) {
      var use = midware()

      use(function(arg1, arg2, next) {
        assert.equal(arg1, 1)
        assert.equal(arg2, 2)
        assert.equal(typeof next, 'function')
        done()
      })
      use.run(1, 2)
    })

    it('should modify args', function(done) {
      var use = midware()
        , arg = { foo: 'bar' }

      use(function(obj, next) {
        assert.strictEqual(obj, arg)
        arg.baz = 'qux'
        next()
      })
      use(function(obj, next) {
        assert.strictEqual(obj, arg)
        assert.equal(obj.baz, 'qux')
        done()
      })
      use.run(arg)
    })

    it('should add multiple', function(done) {
      var use = midware()

      use(function(next) { next() }
        , function(next) { done() }
      )
      use.run()
    })

    it('should ignore non-function arguments', function (done) {
      var use = midware()

      use({}, [], undefined, 'invalid',
        function(next) { done() }
      )
      use.run()
    })

    it('should have applied context', function(done) {
      var context = {}
      var use = midware(context)

      use(function(next) {
        assert.strictEqual(context, this)
        next()
      })
      use.run(function(err) {
        assert.strictEqual(context, this)
        done()
      })
    })

    it('should pass a function as arg', function(done) {
      var use = midware()

      use(function(fn, next) {
        assert.equal(typeof fn, 'function')
        fn()
      })

      use.run(done, null)
    })
  })

  describe('#run()', function() {
    it('should callback done', function(done) {
      var use = midware()

      use(function(next) { next() })

      use.run(function(err) {
        assert.equal(err, null)
        done()
      })
    })

    it('should callback done, with args', function(done) {
      var use = midware()

      use(function(arg1, arg2, next) {
        assert.equal(arg1, 1)
        assert.equal(arg2, 2)
        assert.equal(typeof next, 'function')
        next()
      })

      use.run(1, 2, function(err) {
        assert.equal(err, null)
        done()
      })
    })

    it('should stop on error', function(done) {
      var use = midware()

      use(function(next) { next(new Error()) }
        , function() { throw new Error('should never have thrown') }
      )

      use.run(function(err) {
        assert.ok(err instanceof Error)
        done()
      })
    })

    it('should finish early', function(done) {
      var use = midware()

      use(function(next) { next(null, true) }
        , function() { throw new Error('should never have thrown') }
      )

      use.run(function(err, end) {
        assert.equal(err, null)
        assert.equal(end, true)
        done()
      })
    })
  })

  describe('#remove()', function() {
    it('should remove by function reference', function (done) {
      var use = midware()
      var fn = function (next) { next('err') }
      use(fn)
      use(function (next) { next() })
      
      use.remove(fn)
      assert.equal(use.stack.length, 1)

      use.run(function (err) {
        assert.equal(err, null)
        done()
      })
    })

    it('should remove by function name', function (done) {
      var use = midware()
      function fn(next) { next('err') }
      use(fn)
      use(function (next) { next() })
      use.remove('fn')
      assert.equal(use.stack.length, 1)

      use.run(function (err) {
        assert.equal(err, null)
        done()
      })
    })

    it('should not remove a missing function', function (done) {
      var use = midware()
      use(function (next) { next() })
      use.remove('missing')
      assert.equal(use.stack.length, 1)

      use.run(function (err) {
        assert.equal(err, null)
        done()
      })
    })
  })
})

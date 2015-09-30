define [
  'cs!EventHandler'
], (
  EventHandler
) ->

  describe 'EventHandler', ->
    evt = null
    spy = null
    spy2 = null

    beforeEach ->
      evt = new EventHandler()
      spy = jasmine.createSpy('eventCallback')
      spy2 = jasmine.createSpy('eventCallback2')
      evt.on(spy)
      evt.on(spy2)

    it 'should exist', () ->
      expect(EventHandler).toBeDefined()
      expect(typeof EventHandler).toBe('function')
      expect(evt instanceof EventHandler).toBe(true)

    it 'passes through arguments', ->
      evt.fire()
      expect(spy).toHaveBeenCalledWith()

      evt.fire('This', 'is', 'a', 'test')
      expect(spy).toHaveBeenCalledWith('This', 'is', 'a', 'test')

      evt.fire(77)
      expect(spy).toHaveBeenCalledWith(77)

    it 'can run the callbacks async', (done) ->
      expect(spy).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()
      evt.fireAsync()
      expect(spy).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()

      (checkCalls = ->
        if (spy.calls.count() > 0 && spy2.calls.count() > 0)
          expect(spy).toHaveBeenCalled()
          expect(spy2).toHaveBeenCalled()
          done()
        else
          setTimeout(checkCalls, 0)
      )()

    it 'can run the callbacks async (with args)', (done) ->
      expect(spy).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()
      evt.fireAsync('async', 'call')
      expect(spy).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()

      (checkCalls = ->
        if (spy.calls.count() > 0 && spy2.calls.count() > 0)
          expect(spy).toHaveBeenCalledWith('async', 'call')
          expect(spy2).toHaveBeenCalledWith('async', 'call')
          done()
        else
          setTimeout(checkCalls, 0)
      )()

    it 'can unregister callbacks', ->
      evt.off(spy)
      expect(evt.list.length).toBe(1)
      evt.fire()
      expect(spy).not.toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()

    it 'can unregister all callbacks', ->
      spy3 = jasmine.createSpy('eventCallback3')
      evt.on(spy3)
      expect(evt.list.length).toBe(3)
      evt.off()
      expect(evt.list.length).toBe(0)
      evt.fire()
      expect(spy).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()
      expect(spy3).not.toHaveBeenCalled()

    it 'can be unregistered by ref', ->
      spy3 = jasmine.createSpy('eventCallback3')
      ref = evt.on(spy3)
      expect(evt.list.length).toBe(3)
      ref.off()
      expect(evt.list.length).toBe(2)

  describe 'EventHandler (firesOnce)', ->
    evt = null
    spy = null

    beforeEach ->
      evt = new EventHandler(true)
      spy = jasmine.createSpy('eventCallback')
      evt.on(spy)

    it 'Fires on reg after firing once', (done) ->
      expect(spy).not.toHaveBeenCalled()
      evt.fire('test')
      expect(spy).toHaveBeenCalledWith('test')

      evt.on (arg) ->
        expect(arg).not.toBeDefined()
        done()

  describe 'EventHandler (fireAtReg)', ->

    it 'Can take a boolean value', (done) ->
      evt = new EventHandler(false, true)
      evt.on (arg) ->
        expect(arg).not.toBeDefined()
        done()

    it 'Can take a function', (done) ->
      switchedOn = false
      evt = new EventHandler false, -> switchedOn == true
      spy = jasmine.createSpy('eventCallback')
      evt.on(spy)
      expect(spy).not.toHaveBeenCalled()

      switchedOn = true
      evt.on (arg) ->
        expect(arg).not.toBeDefined()
        done()

    it 'Can pass args', (done) ->
      testArgs = ['here', 'are', 'some', 'args', 42]
      evt = new EventHandler(false, true, testArgs)
      evt.on (args...) ->
        expect(args.length).toBe(testArgs.length)
        expect(arg).toBe(testArgs[i]) for arg, i in args
        done()

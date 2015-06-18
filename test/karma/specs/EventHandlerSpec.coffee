define [
  'cs!EventHandler'
], (
  EventHandler
) ->

  describe 'EventHandler', ->
    evt = null
    spy = null

    beforeEach ->
      evt = new EventHandler()
      spy = jasmine.createSpy('eventCallback')
      evt.on(spy)

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
      evt.fireAsync()
      expect(spy).not.toHaveBeenCalled()

      (checkCalls = ->
        if (spy.calls.count() > 0)
          expect(spy).toHaveBeenCalled()
          done()
        else
          setTimeout(checkCalls, 0)
      )()

    it 'can run the callbacks async (with args)', (done) ->
      expect(spy).not.toHaveBeenCalled()
      evt.fireAsync('async', 'call')
      expect(spy).not.toHaveBeenCalled()

      (checkCalls = ->
        if (spy.calls.count() > 0)
          expect(spy).toHaveBeenCalledWith('async', 'call')
          done()
        else
          setTimeout(checkCalls, 0)
      )()

    it 'can unregister callbacks', ->
      evt.off(spy)
      expect(evt.list.length).toBe(0)
      evt.fire()
      expect(spy).not.toHaveBeenCalled()

    it 'can unregister all callbacks', ->
      spy2 = jasmine.createSpy('eventCallback2')
      evt.on(spy2)
      expect(evt.list.length).toBe(2)
      evt.off()
      expect(evt.list.length).toBe(0)
      evt.fire()
      expect(spy).not.toHaveBeenCalled()
      expect(spy2).not.toHaveBeenCalled()

    it 'can be unregistered by ref', ->
      spy2 = jasmine.createSpy('eventCallback2')
      ref = evt.on(spy2)
      expect(evt.list.length).toBe(2)
      ref.off()
      expect(evt.list.length).toBe(1)

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

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
      evt.fireAsync('async', 'call')
      expect(spy).not.toHaveBeenCalled()

      (checkCalls = ->
        if (spy.calls.count() > 0)
          expect(spy).toHaveBeenCalledWith('async', 'call')
          done()
        else
          setTimeout(checkCalls, 0)
      )()

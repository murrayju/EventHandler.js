define [
  'cs!EventHandler'
], (
  EventHandler
) ->

  describe 'EventHandler', ->

    it 'should exist', () ->
      expect(EventHandler).toBeDefined()
      expect(typeof EventHandler).toBe('function')

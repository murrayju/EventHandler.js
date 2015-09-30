((root, factory) ->
  if (typeof define == 'function' && define.amd?)
    # AMD
    define([], factory)
  else if (typeof exports == 'object')
    # CommonJS
    module.exports = factory()
  else
    # global
    root.EventHandler = factory()
) this, ->
  return class EventHandler
    constructor: (
      @firesOnce = false
      @fireAtReg = false
      @fireAtRegArgs = []
    ) ->
      @list = []
      @fireNow = false

    fire: (args...) ->
      fn.apply(this, args) for fn in @list
      @fireNow = @firesOnce

    fireAsync: (args...) ->
      for fn in @list
        do (fn) =>
          setTimeout(
            => fn.apply(this, args)
            0
          )
      @fireNow = @firesOnce

    # emit as alias for fire
    emit: @.prototype.fire
    emitAsync: @.prototype.fireAsync

    on: (fn) ->
      @list.push fn
      if @fireNow or @fireAtReg?() or @fireAtReg is true
        setTimeout(
          => fn.apply(this, @fireAtRegArgs)
          0
        )
      result =
        fn: fn
        evt: this
        off: ->
          result.evt.off(result.fn)

    off: (fn) ->
      if fn?
        @list = (x for x in @list when x isnt fn)
      else
        @list.length = 0


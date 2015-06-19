/*! eventhandler.js v0.1.2+0.master.5ea164de7b6a | (c) 2015 Justin Murray | built on 2015-06-19 */

(function() {
  var slice = [].slice;

  (function(root, factory) {
    if (typeof define === 'function' && (define.amd != null)) {
      return define([], factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.EventHandler = factory();
    }
  })(this, function() {
    var EventHandler;
    return EventHandler = (function() {
      function EventHandler(firesOnce, fireAtReg, fireAtRegArgs) {
        this.firesOnce = firesOnce != null ? firesOnce : false;
        this.fireAtReg = fireAtReg != null ? fireAtReg : false;
        this.fireAtRegArgs = fireAtRegArgs != null ? fireAtRegArgs : [];
        this.list = [];
        this.fireNow = false;
      }

      EventHandler.prototype.fire = function() {
        var args, fn, i, len, ref;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        ref = this.list;
        for (i = 0, len = ref.length; i < len; i++) {
          fn = ref[i];
          fn.apply(this, args);
        }
        return this.fireNow = this.firesOnce;
      };

      EventHandler.prototype.fireAsync = function() {
        var args, fn, i, len, ref;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        ref = this.list;
        for (i = 0, len = ref.length; i < len; i++) {
          fn = ref[i];
          setTimeout((function(_this) {
            return function() {
              return fn.apply(_this, args);
            };
          })(this), 0);
        }
        return this.fireNow = this.firesOnce;
      };

      EventHandler.prototype.emit = EventHandler.prototype.fire;

      EventHandler.prototype.emitAsync = EventHandler.prototype.fireAsync;

      EventHandler.prototype.on = function(fn) {
        var result;
        this.list.push(fn);
        if (this.fireNow || (typeof this.fireAtReg === "function" ? this.fireAtReg() : void 0) || this.fireAtReg === true) {
          setTimeout((function(_this) {
            return function() {
              return fn.apply(_this, _this.fireAtRegArgs);
            };
          })(this), 0);
        }
        return result = {
          fn: fn,
          evt: this,
          off: function() {
            return result.evt.off(result.fn);
          }
        };
      };

      EventHandler.prototype.off = function(fn) {
        var x;
        if (fn != null) {
          return this.list = (function() {
            var i, len, ref, results;
            ref = this.list;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              x = ref[i];
              if (x !== fn) {
                results.push(x);
              }
            }
            return results;
          }).call(this);
        } else {
          return this.list.length = 0;
        }
      };

      return EventHandler;

    })();
  });

}).call(this);

//# sourceMappingURL=EventHandler.js.map

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // global
        root.EventHandler = factory();
    }
}(this, function () {
    //almond, and all other modules will be inlined here

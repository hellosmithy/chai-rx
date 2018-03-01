(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'lodash'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('lodash'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodash);
    global.chaiRx = mod.exports;
  }
})(this, function (exports, _) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = chaiRx;


  function createMessage(expected, actual) {
    return 'Expected: \r\n' + JSON.stringify(expected) + '\r\nActual: \r\n' + JSON.stringify(actual);
  }
  // see https://github.com/Reactive-Extensions/RxJS/blob/master/tests/helpers/reactiveassert.js
  function chaiRx(chai, _utils) {
    chai.Assertion.addMethod('emit', function emitAssertion(expected) {
      var obj = this._obj;
      var actual = obj.messages;

      var isOk = true;

      if (expected.length !== actual.length) {
        this.assert(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
        return;
      }

      for (var i = 0, len = expected.length; i < len; i++) {
        var e = expected[i],
            a = actual[i];
        // Allow for predicates
        if (e.value && typeof e.value.predicate === 'function') {
          isOk = e.time === a.time && e.value.predicate(a.value);
        } else {
          isOk = _.isEqual(e, a);
        }

        if (!isOk) {
          break;
        }
      }

      this.assert(isOk, createMessage(expected, actual));
    });
  }
});
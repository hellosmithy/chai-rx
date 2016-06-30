(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'rx'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('rx'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.rx);
    global.chaiRx = mod.exports;
  }
})(this, function (exports, _rx) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = chaiRx;

  var _rx2 = _interopRequireDefault(_rx);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function createMessage(expected, actual) {
    return 'Expected: [' + JSON.stringify(expected) + ']\r\nActual: [' + JSON.stringify(actual) + ']';
  }

  function chaiRx(chai, _utils) {
    chai.Assertion.addMethod('emit', function emitAssertion(expected) {
      var obj = this._obj;
      var actual = obj.messages;

      var comparer = _rx2.default.internals.isEqual;
      var isOk = true;

      if (expected.length !== actual.length) {
        this.assert(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
        return;
      }

      for (var i = 0, len = expected.length; i < len; i++) {
        isOk = comparer(expected[i], actual[i]);
        if (!isOk) {
          break;
        }
      }

      this.assert(isOk, createMessage(expected, actual));
    });
  }
});
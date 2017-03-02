import Rx from 'rx';

function createMessage(expected, actual) {
  return `Expected: [${JSON.stringify(expected)}]\r\nActual: [${JSON.stringify(actual)}]`;
}
// see https://github.com/Reactive-Extensions/RxJS/blob/master/tests/helpers/reactiveassert.js
export default function chaiRx(chai, _utils) {
  chai.Assertion.addMethod('emit', function emitAssertion(expected) {
    const obj = this._obj;
    const actual = obj.messages;

    const comparer = Rx.internals.isEqual;
    let isOk = true;

    if (expected.length !== actual.length) {
      this.assert(false, `Not equal length. Expected: ${expected.length} Actual: ${actual.length}`);
      return;
    }

    for (let i = 0, len = expected.length; i < len; i++) {
      var e = expected[i], a = actual[i];
      // Allow for predicates
      if (e.value && typeof e.value.predicate === 'function') {
        isOk = e.time === a.time && e.value.predicate(a.value);
      } else {
        isOk = comparer(e, a);
      }

      if (!isOk) {
        break;
      }
    }

    this.assert(isOk, createMessage(expected, actual));
  });
}

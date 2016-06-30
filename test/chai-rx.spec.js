import Rx from 'rx';
const { onNext, onCompleted } = Rx.ReactiveTest;

describe('chai-rx', () => {
  describe('emit', () => {
    let scheduler;
    beforeEach(() => {
      scheduler = new Rx.TestScheduler();
    });
    it('should compare a TestScheduler observer object to a given array of messages', () => {
      // Create hot observable which will start firing
      const xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onNext(220, 3),
        onCompleted(230)
      );
      // Note we'll start at 200 for subscribe, hence missing the 150 mark
      const output = scheduler.startScheduler(() => xs.map(x => x * x), {
        created: 100,
        subscribed: 200,
        disposed: 300
      });

      expect(output).to.emit([
        onNext(210, 4),
        onNext(220, 9),
        onCompleted(230)
      ]);
    });
  });
});

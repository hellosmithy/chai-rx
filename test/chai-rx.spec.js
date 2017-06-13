import chai from 'chai';
import Rx from 'rx';
const { onNext, onError, onCompleted } = Rx.ReactiveTest;

describe('chai-rx', () => {
  describe('emit', () => {

    describe('`expect` syntax', () => {
      it('should decorate `expect().to`', () => {
        const emit = expect().to.emit;
        expect(emit).to.be.a('function');
      });
      it('should decorate `expect().to.not`', () => {
        const emit = expect().to.not.emit;
        expect(emit).to.be.a('function');
      });
      it('should negate matches when prefixed with `not`', () => {
        const scheduler = new Rx.TestScheduler();
        const xs = scheduler.createHotObservable(onNext(150));
        const output = scheduler.startScheduler(() => xs);

        expect(output).to.not.emit([
          onNext(150) // fired before subscription so doesn't emit
        ]);
      })
    });

    describe('`should` syntax', () => {
      it('should decorate `should`', () => {
        const emit = {}.should.emit;
        expect(emit).to.be.a('function');
      });
      it('should decorate `should.not`', () => {
        const emit = {}.should.not.emit;
        expect(emit).to.be.a('function');
      });
    });

    describe('README examples', () => {
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

      describe('`expect` usage', () => {
        it('should pass with `expect`', () => {
          const xs = scheduler.createHotObservable(onNext(250, { 'foo': 'bar' }), onError(300, new Error('An error')));
          const output = scheduler.startScheduler(() => xs);
          expect(output).to.emit([
            onNext(250, { 'foo': 'bar' }),
            onError(300, ({error}) => error.message === 'An error')
          ]);
        });
      });

      describe('`should` usage', () => {
        it('should pass with `should`', () => {
          const xs = scheduler.createHotObservable(onNext(250, { 'foo': 'bar' }), onError(300, new Error('An error')));
          const output = scheduler.startScheduler(() => xs);
          output.should.emit([
            onNext(250, { 'foo': 'bar' }),
            onError(300, ({error}) => error.message === 'An error')
          ]);
        });
      });

      describe('Language chains', () => {
        it('should pass with `not` chain', () => {
          const xs = scheduler.createHotObservable(onNext(250, { 'foo': 'bar' }));
          const output = scheduler.startScheduler(() => xs);
          expect(output).to.not.emit([
            onNext(300, { 'foo': 'bar' })
          ]);
        });
      });

    });
  });

});

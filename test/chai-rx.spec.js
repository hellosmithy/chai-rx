import chai from 'chai';
import { TestScheduler, Notification, Observable } from 'rxjs';

describe('chai-rx', () => {
  const message = (frame, notification) => {
    return { frame: frame, notification: notification }
  }

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
        const scheduler = new TestScheduler();
        const source = scheduler.createHotObservable("---------------");
        scheduler.flush();
        expect(source).to.not.emit([
          // fired before subscription so doesn't emit
          message(150, undefined)
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
        scheduler = new TestScheduler();
      });
      it('should compare a TestScheduler observer object to a given array of messages', () => {
        // Create hot observable which will start firing
        const source = scheduler.createHotObservable("---------------1----^----------------2----------------------3|");
        scheduler.flush()

        expect(source).to.emit([
          message(-50, Notification.createNext("1")),
          message(170, Notification.createNext("2")),
          message(400, Notification.createNext("3")),
          message(410, Notification.createComplete())
        ]);
      });

      describe('`expect` usage', () => {
        it('should pass with `expect`', () => {
          const source = scheduler.createHotObservable("-------------------------f-----#", { 'f': 'bar' }, new Error('An error'));
          scheduler.flush();
          expect(source).to.emit([
            message(250, Notification.createNext('bar')),
            message(310, Notification.createError(new Error('An error')))
          ]);
        });
      });

      describe('`should` usage', () => {
        it('should pass with `should`', () => {
          const source = scheduler.createHotObservable("-------------------------f-----#", { 'f': 'bar' }, new Error('An error'));
          scheduler.flush();
          source.should.emit([
            message(250, Notification.createNext('bar')),
            message(310, Notification.createError(new Error('An error')))
          ]);
        });
      });

      describe('Language chains', () => {
        it('should pass with `not` chain', () => {
          const source = scheduler.createHotObservable("-------------------------f", { 'f': 'bar' });
          scheduler.flush();
          expect(source).to.not.emit([
            message(310, Notification.createNext('bar'))
          ]);
        });
      });

    });
  });

});

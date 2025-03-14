import type { AbstractEventBusEventType} from './EventBus';
import {register, emit} from './EventBus';

describe('Test EventBus Core Features', () => {
  const eventType1 = 'testEvent1';
  const eventPayload = 'testValue';

  const asyncEventType = 'testAsyncEvent';
  const asyncEventPayload = 'testAsyncValue';

  it('should register a listener and receive an event', () => {
    let count = 0;

    const subscription = register(
      {type: eventType1},
      (value: AbstractEventBusEventType) => {
        count++;
        expect(value.payload).toBe(eventPayload);
      }
    );
    const subscription2 = register(
      {type: eventType1},
      (value: AbstractEventBusEventType) => {
        count++;
        expect(value.payload).toBe(eventPayload);
      }
    );
    const subscription3 = register({type: 'different-event'}, () => count++);

    emit({
      type: eventType1,
      payload: eventPayload,
    });

    expect(count).toBe(2);
    expect(subscription.closed).toBe(false);
    expect(subscription2.closed).toBe(false);
    expect(subscription3.closed).toBe(false);

    cleanSubscriptions([subscription, subscription2, subscription3]);
  });

  it('should remove the listener', () => {
    let count = 0;

    const subscription = register({type: eventType1}, () => count++);
    const subscription2 = register({type: eventType1}, () => count++);

    subscription.unsubscribe();

    emit({
      type: eventType1,
      payload: eventPayload,
    });

    expect(count).toBe(1);
    expect(subscription.closed).toBe(true);
    expect(subscription2.closed).toBe(false);

    subscription2.unsubscribe();

    emit({
      type: eventType1,
      payload: eventPayload,
    });

    expect(count).toBe(1);
    expect(subscription.closed).toBe(true);
    expect(subscription2.closed).toBe(true);
  });

  it('should remove only listeners related with subscription', () => {
    let count = 0;

    const subscription = register({type: eventType1}, () => count++);
    const subscription2 = register({type: eventType1}, () => count++);

    subscription.unsubscribe();
    subscription.unsubscribe();

    emit({
      type: eventType1,
      payload: eventPayload,
    });

    expect(count).toBe(1);
    expect(subscription.closed).toBe(true);
    expect(subscription2.closed).toBe(false);

    subscription2.unsubscribe();

    emit({
      type: eventType1,
      payload: eventPayload,
    });

    expect(count).toBe(1);
    expect(subscription.closed).toBe(true);
    expect(subscription2.closed).toBe(true);

    cleanSubscriptions([subscription2]);
  });

  it('should broadcast events to all subscriptions (even if listener is removed after first emit for one subscription)', () => {
    let count = 0;

    const subscription = register({type: eventType1}, () => {
      subscription.unsubscribe();
      count++;
    });
    const subscription2 = register({type: eventType1}, () => count++);

    emit({
      type: eventType1,
      payload: eventPayload,
    });

    expect(count).toBe(2);
    expect(subscription.closed).toBe(true);
    expect(subscription2.closed).toBe(false);

    cleanSubscriptions([subscription2]);
  });

  it('should register a listener and receive a promise', done => {
    let count = 0;

    const subscription = register(
      {type: asyncEventType},
      (value: AbstractEventBusEventType) => {
        count++;
        expect(count).toBe(1);
        expect(value.type).toBe(asyncEventType);
        expect(value.payload).toBe(asyncEventPayload);
        cleanSubscriptions([subscription]);
        done();
      }
    );

    const asyncEvent = createAsyncEvent({
      type: asyncEventType,
      payload: asyncEventPayload,
    });

    emit(asyncEvent);
  });

  it('should remove the listener for async event', () => {
    let count = 0;

    const subscription = register({type: asyncEventType}, () => count++);

    subscription.unsubscribe();

    emit({
      type: asyncEventType,
      payload: asyncEventPayload,
    });

    expect(count).toBe(0);
    expect(subscription.closed).toBe(true);
  });

  function cleanSubscriptions(subscriptions: {unsubscribe: () => void}[]) {
    subscriptions.forEach(sub => sub.unsubscribe());
  }

  function createAsyncEvent(
    event: AbstractEventBusEventType
  ): Promise<AbstractEventBusEventType> {
    return new Promise<AbstractEventBusEventType>(resolve => {
      setTimeout(() => {
        resolve(event);
      }, 10);
    });
  }
});

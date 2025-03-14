import { promiseFromEvent } from './promiseFromEvent';

describe('promiseFromEvent()', () => {
  it('return promise with event from preferred listener', async () => {
    const promisedEvent = promiseFromEvent('test-event', window);
    const testEvent = new Event('test-event');

    window.dispatchEvent(testEvent);

    expect(await promisedEvent).toBe(testEvent);
  });
});

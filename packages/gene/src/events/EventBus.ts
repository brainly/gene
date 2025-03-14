import { Observable } from 'zen-observable-ts';
import { compose } from 'ramda';

export interface AbstractEventBusEventType<PayloadType = unknown> {
  payload?: PayloadType;
  type: string;
}
// TODO fix any[]
const subscriberMap = new Map<string, any[]>();
// used to intercept events, cause side effects, and forward to subscribers
// SHOULD BE INTERNAL ONLY! Do not expose this to the public.
const interceptors: ((value: AbstractEventBusEventType) => typeof value)[] = [];
// singletons
let observer: ZenObservable.Observer<AbstractEventBusEventType>;
let observable: Observable<AbstractEventBusEventType>;

// internals
// this function take care of notifying registered listeners about the event
// note, this happens after registered interceptors are fired!
const multicast = function (event: AbstractEventBusEventType) {
  let transformedEvent = event;

  // will cause side effects by design!
  interceptors.forEach((interceptor) => {
    transformedEvent = interceptor(transformedEvent);
  });
  subscriberMap
    .get(transformedEvent.type)
    ?.forEach((callback: (value: AbstractEventBusEventType) => void) => {
      callback(transformedEvent);
    });
};

// factories
const zenObservable = function <T extends AbstractEventBusEventType>() {
  if (observable) {
    return observable;
  }
  observable = new Observable<T>((o) => {
    observer = o;
    // TODO figure out cleanup when the observable is destroyed
    return () => null;
  });

  observable
    .map((item: AbstractEventBusEventType) => item)
    .subscribe(multicast);
  return observable;
};

const registerFactory = function <T extends AbstractEventBusEventType>() {
  return (event: T, onNext: (value: T) => void) => {
    let subscriber = subscriberMap.get(event.type);

    if (!subscriber) {
      subscriber = [];
      subscriberMap.set(event.type, subscriber);
    }

    subscriber.push(onNext);
    // operation is idempotent
    return {
      closed: false,
      unsubscribe() {
        if (this.closed) {
          return;
        }

        const subscriber = subscriberMap.get(event.type);

        if (!subscriber) {
          console.error('Unable to find subscriber for', event.type);
          return;
        }

        this.closed = true;
        subscriberMap.set(
          event.type,
          subscriber.filter((payload) => payload !== onNext),
        );
      },
    };
  };
};

const emitFactory = function () {
  return async function <T extends AbstractEventBusEventType>(
    event: T | Promise<T>,
  ) {
    const result = event instanceof Promise ? await event : event;

    observer.next?.(result);
  };
};

// exports
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const emit = compose<
  Observable<AbstractEventBusEventType>,
  (
    event: AbstractEventBusEventType | Promise<AbstractEventBusEventType>,
  ) => void
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
>(emitFactory, zenObservable)();

// in the future I think we could have some more interceptors besides trace
// please note that registerFactory must be last in composition due to the number of args
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const register = compose<
  Observable<AbstractEventBusEventType>,
  (
    event: AbstractEventBusEventType,
    onNext: (value: AbstractEventBusEventType) => void,
  ) => ZenObservable.Subscription
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
>(registerFactory, zenObservable)();

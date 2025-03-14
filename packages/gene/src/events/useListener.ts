import type React from 'react';
import { useEffect } from 'react';

interface EventHandlerArgsType<T, PayloadT> {
  type: T;
  payload: PayloadT;
}

type ListenerType = [any, any?];

export const useListener = <T extends ListenerType>(
  eventType: T[0],
  eventHandler: (event: EventHandlerArgsType<T[0], T[1]>) => unknown,
  ref: React.RefObject<any>,
) => {
  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) {
      return;
    }

    function listenerEventHandler(e: CustomEvent) {
      eventHandler({
        type: eventType,
        payload: e.detail,
      });
    }

    currentRef.addEventListener(eventType, listenerEventHandler);

    return () => {
      currentRef.removeEventListener(eventType, listenerEventHandler);
    };
  }, [eventHandler, eventType, ref]);
};

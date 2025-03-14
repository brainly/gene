import React, {useEffect} from 'react';

interface EventHandlerArgsType<T, PayloadT> {
  type: T;
  payload: PayloadT;
}

type MediatorType = [any, any?];

export const useMediator = <T extends MediatorType>(
  eventType: T[0],
  eventHandler: (event: EventHandlerArgsType<T[0], T[1]>) => unknown,
  ref: React.RefObject<any>
) => {
  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) {
      return;
    }

    function listenerEventHandler(e: CustomEvent) {
      e.stopImmediatePropagation();
      eventHandler({
        type: eventType,
        payload: e.detail,
      });
    }

    currentRef.addEventListener(eventType, listenerEventHandler, {
      useCapture: true,
    });

    return () => {
      currentRef.removeEventListener(eventType, listenerEventHandler);
    };
  }, [eventHandler, eventType, ref]);
};

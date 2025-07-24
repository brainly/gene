import React, { useEffect, useRef } from 'react';
import type Observable from 'zen-observable';

import { useIsMounted } from './useIsMounted';

// Adapter for observable -> React (hook)
/**
 * Forces a component re-render whenever new observable value is received
 *
 * @param observable
 */
export function useObservableQuery<T>(observable: Observable<T>) {
  // we call rerender() to force component update
  // whenever we get a new observable value
  const [, rerender] = React.useReducer((c) => c + 1, 0);

  const isMounted = useIsMounted();
  const lastValue = useRef<T>(undefined);

  useEffect(() => {
    const subcription = observable.subscribe((next) => {
      if (isMounted()) {
        lastValue.current = next;
        rerender();
      }
    });

    return () => {
      subcription.unsubscribe?.();
    };
  }, [isMounted]);

  return lastValue.current;
}

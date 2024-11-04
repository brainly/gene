import React, { useEffect, useRef, useState } from 'react';
import Observable from 'zen-observable';

// Adapter for observable -> React (hook)
/**
 * Forces a component re-render whenever new observable value is received
 *
 * @param observable
 */
export function useObservableQueryV2<T>(
  observable: Observable<T>,
  queryHash: string
) {
  // we call rerender() to force component update
  // whenever we get a new observable value
  const [, rerender] = React.useReducer((c) => c + 1, 0);

  const [isMounted, setIsMounted] = React.useState(false);
  React.useLayoutEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const lastValue = useRef<T>();

  useEffect(() => {
    const subcription = observable.subscribe((next) => {
      if (isMounted) {
        lastValue.current = next;
        rerender();
      }
    });

    return () => {
      subcription.unsubscribe?.();
    };
  }, [isMounted, queryHash]);

  return lastValue.current;
}

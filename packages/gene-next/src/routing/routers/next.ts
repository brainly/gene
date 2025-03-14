import { useRouter } from 'next/router';
import React from 'react';
import type {
  NavigateOptions,
  Router,
  RouterEvent,
  UrlObject,
} from '@brainly-gene/core';
import { useGenerator } from './generate';
import { assign } from './native';
import { Observable } from 'zen-observable-ts';

export function useTransformedNextRouter(): Router {
  const {
    pathname,
    query,
    basePath,
    reload,
    replace: nativeReplace,
    push,
    asPath,
    events,
    back,
  } = useRouter();

  const generate = useGenerator();

  const parsedQuery = query as Record<string, string>;

  const openInNewTab = React.useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.open(path, '_blank');
    }
  }, []);

  const $routeChanged = React.useMemo(
    () =>
      new Observable<RouterEvent>((observer) => {
        const handleStart = (path: string, options?: NavigateOptions) => {
          observer.next({
            type: 'routeChangeStart',
            payload: {
              path,
              options,
            },
          });
        };

        const handleComplete = (path: string, options?: NavigateOptions) => {
          observer.next({
            type: 'routeChangeComplete',
            payload: {
              path,
              options,
            },
          });
        };

        const handleError = (path: string, options?: NavigateOptions) => {
          observer.next({
            type: 'routeChangeError',
            payload: {
              path,
              options,
            },
          });
        };

        if (events) {
          events.on('routeChangeStart', handleStart);
          events.on('routeChangeComplete', handleComplete);
          events.on('routeChangeError', handleError);

          return () => {
            events.off('routeChangeStart', handleStart);
            events.off('routeChangeComplete', handleComplete);
            events.off('routeChangeError', handleError);
          };
        }
        return () => null;
      }),
    [events],
  );

  const navigate = React.useCallback(
    (path: string | UrlObject, options?: NavigateOptions) => {
      return push(path, options?.as ?? undefined, options);
    },
    [push],
  );

  const replace = React.useCallback(
    (path: string | UrlObject, options?: NavigateOptions) =>
      nativeReplace(path, undefined, options),
    [nativeReplace],
  );

  return {
    pathname,
    query: parsedQuery,
    basePath,
    assign,
    reload,
    navigate,
    replace,
    openInNewTab,
    generate,
    asPath,
    $routeChanged,
    back,
  };
}

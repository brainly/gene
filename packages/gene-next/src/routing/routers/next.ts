import { useRouter, NextRouter } from 'next/router';
import React from 'react';
import {
  NavigateOptions,
  Router,
  RouterEvent,
  UrlObject,
} from '@brainly/gene';
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
        const handler = ([currentPathname]: [string]) => {
          observer.next({
            type: 'routeChanged',
            payload: {
              currentPathname,
            },
          });
        };

        if (events) {
          events.on('routeChangeComplete', handler);

          return () => events.off('routeChangeComplete', handler);
        }
        return () => null;
      }),
    [events]
  );

  const navigate = React.useCallback(
    (path: string | UrlObject, options?: NavigateOptions) => {
      return push(path, options?.as ?? undefined, options);
    },
    [push]
  );

  const replace = React.useCallback(
    (path: string | UrlObject, options?: NavigateOptions) =>
      nativeReplace(path, undefined, options),
    [nativeReplace]
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

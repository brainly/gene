import { isServer } from '../utils';
import React from 'react';
import type {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserver,
  InfiniteQueryObserverResult,
  QueryObserver,
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';

export type CommonObserverResultType<T> =
  | InfiniteQueryObserverResult<T>
  | (QueryObserverResult<T> & {
      fetchNextPage: undefined;
      fetchPreviousPage: undefined;
      hasNextPage: boolean;
    });

type ObserverResultData<TData, TObserver> =
  TObserver extends InfiniteQueryObserver<TData> ? InfiniteData<TData> : TData;

type ObservableType<TData> =
  | QueryObserver<TData>
  | InfiniteQueryObserver<TData>;

interface ReturnType<TData, TObservable> {
  error: string | null;
  data: ObserverResultData<TData, TObservable> | undefined;
  loading: boolean;
  refetch:
    | ((options?: RefetchOptions) => Promise<QueryObserverResult<TData, Error>>)
    | ((
        options?: RefetchOptions,
      ) => Promise<QueryObserverResult<InfiniteData<TData, unknown>, Error>>);
  fetchPreviousPage: (
    options?: FetchPreviousPageOptions,
  ) => Promise<InfiniteQueryObserverResult<unknown, Error>>;
  fetchMore: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<unknown, Error>>;
  hasNextPage: boolean;
}

/**
 *
 * @deprecated
 * Do not use this. Regenerate the service with the new version of Gene.
 */
export function useReactQueryObservableQuery<
  TData,
  TObservable = ObservableType<TData>,
>(observable: ObservableType<TData>) {
  const [, rerender] = React.useReducer((c) => c + 1, 0);

  const mountedRef = React.useRef(false);

  const lastValue = React.useRef<
    | QueryObserverResult<TData, Error>
    | InfiniteQueryObserverResult<InfiniteData<TData, unknown>, Error>
  >();

  React.useEffect(() => {
    mountedRef.current = true;

    const unsubscribe = observable.subscribe((next) => {
      if (mountedRef.current) {
        lastValue.current = next;
        rerender();
      }
    });

    observable.updateResult();

    return () => {
      lastValue.current = undefined;
      rerender();
      unsubscribe();
      mountedRef.current = false;
    };
  }, [observable.options.queryHash]);

  const response = lastValue.current;

  const noop = () => Promise.resolve();

  const isServerValueOrObservableValueIsEmpty = isServer() || !response?.data;

  const currentResponse = isServerValueOrObservableValueIsEmpty
    ? observable.getCurrentResult()
    : response;

  const res: ReturnType<TData, TObservable> = {
    error: (currentResponse?.error?.message as string) || null,
    data: currentResponse?.data as
      | ObserverResultData<TData, TObservable>
      | undefined,
    loading: !!currentResponse?.isLoading,
    refetch: currentResponse?.refetch || noop,
    fetchPreviousPage:
      (currentResponse as InfiniteQueryObserverResult)?.fetchPreviousPage ||
      noop,
    fetchMore:
      (currentResponse as InfiniteQueryObserverResult)?.fetchNextPage || noop,
    hasNextPage:
      (currentResponse as InfiniteQueryObserverResult)?.hasNextPage || false,
  };

  return res;
}

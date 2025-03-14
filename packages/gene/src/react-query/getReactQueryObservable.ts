import type {
  InfiniteQueryObserverOptions,
  QueryClient,
  QueryObserverOptions,
  QueryKey} from '@tanstack/react-query';
import {
  InfiniteQueryObserver,
  QueryObserver
} from '@tanstack/react-query';

/**
 *
 * @deprecated
 * Do not use this. Regenerate the service with the new version of Gene.
 */
export const getReactQueryObservable = <
  TData = any,
  TError = any,
  TQueryData = TData
>(
  client: QueryClient,
  opts: QueryObserverOptions<TData, TError, TData, TQueryData>
) => {
  const obs: QueryObserver<TData, TError, TData, TQueryData, QueryKey> =
    new QueryObserver<TData, TError, TData, TQueryData>(client, {
      ...opts,
    });

  return obs;
};

/**
 *
 * @deprecated
 * Do not use this. Regenerate the service with the new version of Gene.
 */
export const getReactQueryPaginatedObservable = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
>(
  client: QueryClient,
  opts: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData>
) => {
  const obs: InfiniteQueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    QueryKey,
    unknown
  > = new InfiniteQueryObserver<TQueryFnData, TError, TData, TQueryData>(
    client,
    opts
  );

  return obs;
};

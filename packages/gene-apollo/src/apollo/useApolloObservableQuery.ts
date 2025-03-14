import type {
  ObservableQuery,
  ApolloQueryResult,
  FetchMoreQueryOptions,
  FetchMoreOptions,
} from '@apollo/client';

import { transformApolloResponse } from './transformApolloResponse';
import { merge } from 'zen-observable/extras';
import type { Observable } from 'zen-observable-ts';
import type { RouterEvent, RouterIocType } from '@brainly-gene/core';
import {
  isServer,
  ROUTER_SERVICE_IDENTIFIER,
  useObservableQuery,
  useInjection,
} from '@brainly-gene/core';

/**
 *
 * @deprecated
 * Do not use this. Regenerate the service with the new version of Gene.
 */
export function useApolloObservableQuery<TData, TVariables>(
  observable: ObservableQuery<TData, TVariables>
) {
  const { $routeChanged } = useInjection<RouterIocType>(
    ROUTER_SERVICE_IDENTIFIER
  )();

  /**
   * @description
   * We need to be prepare for observable state changed on route changes - then we need to manually
   * render current result as observable tick from ApolloObservable is not happening
   */
  const newObservable = merge(observable, $routeChanged) as Observable<
    ApolloQueryResult<TData> & RouterEvent
  >;
  const response = useObservableQuery<ApolloQueryResult<TData> & RouterEvent>(
    newObservable
  );

  const isRouterEvent = response?.type === 'routeChangeComplete';
  const isServerValueOrRouterEventOrObservableValueIsEmpty =
    isRouterEvent || isServer() || !response?.data;

  return {
    ...transformApolloResponse<TData>(
      isServerValueOrRouterEventOrObservableValueIsEmpty
        ? observable.getCurrentResult()
        : response
    ),
    refetch: async (variables?: TVariables) => observable.refetch(variables),
    fetchMore: async (
      variables: FetchMoreQueryOptions<TVariables, TData> &
        FetchMoreOptions<TData, TVariables>
    ) => observable.fetchMore(variables),
  };
}

import type {
  ApolloClient,
  ObservableQuery,
  NormalizedCacheObject,
  ApolloQueryResult,
  WatchQueryOptions,
} from '@apollo/client';

async function maybeWarmUpCache<TQuery, TVariables>(
  watchQuery: ObservableQuery<TQuery, TVariables>,
  queryFn: () => Promise<ApolloQueryResult<TQuery>>
) {
  watchQuery.result().then((results) => {
    /**
     * partial indicates that no all query data has been fetched
     * which shows that there wasn't server call, or something went wrong
     * and we need to call this query once again
     *
     * documentation for partial:
     * " // https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.watchQuery
     *  If true, perform a query refetch if the query result is marked as being partial,
     *  and the returned data is reset to an empty
     *  Object by the Apollo Client QueryManager (due to a cache miss).
     * "
     *
     * So we should check if partial is "true" and data has empty object
     */
    if (results.partial && Object.keys(results?.data || {}).length === 0) {
      // fetch query and warmup cache object
      queryFn();
    }
  });
}

export function makeWatchQuery<TQuery, TVariables>({
  client,
  queryFn,
  options,
  ssr = false,
}: {
  client: ApolloClient<NormalizedCacheObject>;
  options: WatchQueryOptions<TVariables, TQuery>;
  queryFn: (
    client: ApolloClient<NormalizedCacheObject>,
    variables: TVariables
  ) => Promise<ApolloQueryResult<TQuery>>;
  ssr?: boolean;
}) {
  const ssrFetchPolicy =
    typeof window === 'undefined' ? 'cache-first' : 'cache-only';

  const watchQuery = client.watchQuery<TQuery, TVariables>({
    fetchPolicy: ssr ? ssrFetchPolicy : 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    ...options,
  });

  maybeWarmUpCache(watchQuery, () =>
    queryFn(client, options.variables as TVariables)
  );

  return watchQuery;
}

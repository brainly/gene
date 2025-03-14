import { QueryClient } from '@tanstack/react-query';
import {
  getReactQueryObservable,
  getReactQueryPaginatedObservable,
} from './getReactQueryObservable';
import { reactQueryFetchWrapper } from './reactQueryFetchWrapper';
import type { ExampleResponse, ExamplePaginatedResponse } from '../services';

/**
 *
 * @deprecated
 * Do not use this. Regenerate the service with the new version of Gene.
 */
export function createTestObservable(
  variables: { foo: number } = { foo: 1 },
  client?: QueryClient,
) {
  const _client = client || new QueryClient();
  return getReactQueryObservable(_client, {
    queryKey: ['example-rq', variables],
    retry: false,
    queryFn: () =>
      reactQueryFetchWrapper<ExampleResponse>(() =>
        fetch(`https://jsonplaceholder.typicode.com/todos/${variables.foo}`),
      ),
    staleTime: 500,
  });
}

/**
 *
 * @deprecated
 * Do not use this. Regenerate the service with the new version of Gene.
 */
export function createPaginatedTestObservable() {
  const client = new QueryClient();

  return getReactQueryPaginatedObservable(client, {
    queryKey: ['example-rq'],
    retry: false,
    queryFn: () =>
      reactQueryFetchWrapper<ExamplePaginatedResponse>(() =>
        fetch(`https://jsonplaceholder.typicode.com/todos/1`),
      ),
    getNextPageParam: (lastPage) => {
      return lastPage.data.page + 1;
    },
    initialPageParam: 1,
  });
}

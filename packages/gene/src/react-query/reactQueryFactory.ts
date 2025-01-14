import { dehydrate, hydrate } from '@tanstack/react-query';
import { DehydratedState } from '@tanstack/react-query';

import { QueryClient as TanstackQueryClient } from '@tanstack/react-query';
import { QueryClient as LegacyQueryClient } from '@tanstack/react-query';

type QueryClient = TanstackQueryClient | LegacyQueryClient;

export interface ReactQueryClientType {
  hydrate: (initialState?: DehydratedState) => void;
  dehydrate: () => DehydratedState;
  getClient: () => QueryClient;
}

export function reactQueryFactory(createReactQueryClient: () => QueryClient) {
  const client = createReactQueryClient();

  return {
    hydrate: (initialState?: DehydratedState) => hydrate(client, initialState),
    dehydrate: () => JSON.parse(JSON.stringify(dehydrate(client))), //https://github.com/TanStack/query/issues/1458#issuecomment-747716357
    getClient: () => client,
  };
}

import { Container } from 'inversify';
import type { Factory} from '@brainly-gene/core';
import { factory, ServiceTypes } from '@brainly-gene/core';
import { QueryClient } from '@tanstack/react-query';
import {
  ApolloClient,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client';

export function useServiceClientsContainer() {
  const apolloClient = new ApolloClient({
    uri: 'https://mockurl.com',
    cache: new InMemoryCache(),
    ssrMode: true,
  });
  const queryClient = new QueryClient();

  const clients = {
    [ServiceTypes.reactQuery]: () => {
      return queryClient;
    },
    [ServiceTypes.apollo]: () => {
      return apolloClient;
    },
  };

  const container = new Container();
  container
    .bind<Factory<QueryClient | ApolloClient<NormalizedCacheObject>>>(
      'serviceFactory'
    )
    .toFunction(factory(clients));

  return container;
}

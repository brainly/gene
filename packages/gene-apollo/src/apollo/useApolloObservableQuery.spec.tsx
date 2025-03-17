import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useApolloObservableQuery } from './useApolloObservableQuery';

import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import gql from 'graphql-tag';
import { makeWatchQuery } from './makeWatchQuery';
import { mockFetch } from '@brainly-gene/core';
import { useMockedRouterContainer } from '@brainly-gene/core';
import { Provider } from '@brainly-gene/core';

mockFetch();

const apolloClient = new ApolloClient({
  uri: 'https://mockurl.com',
  cache: new InMemoryCache(),
  ssrMode: true,
});

const query = `
  query GetSomething {
    hello {
      world
    }
  }
`;

const exampleQuery = gql(query);

const ContainerWrapper = ({ children }: { children: React.ReactNode }) => {
  const mockRouter = useMockedRouterContainer();

  return <Provider container={mockRouter}>{children}</Provider>;
};

describe('useApolloObservableQuery', () => {
  it('returns proper data on re-render cycle without hydration', async () => {
    const queryObservable = makeWatchQuery({
      client: apolloClient,
      queryFn: (client: ApolloClient<NormalizedCacheObject>) => {
        return client.query({
          query: exampleQuery,
        });
      },
      options: {
        query: exampleQuery,
      },
    });

    const { result } = renderHook(
      () => useApolloObservableQuery(queryObservable),
      {
        wrapper: ContainerWrapper,
      },
    );

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(undefined);

    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toMatchObject({
      hello: { world: 'value' },
    });
  });

  it('refetches data properly', async () => {
    const queryObservable = makeWatchQuery({
      client: apolloClient,
      queryFn: (client: ApolloClient<NormalizedCacheObject>) => {
        return client.query({
          query: exampleQuery,
        });
      },
      options: {
        query: exampleQuery,
      },
    });

    const { result } = renderHook(
      () => useApolloObservableQuery(queryObservable),
      {
        wrapper: ContainerWrapper,
      },
    );

    // test refetch works correctly
    const refetchedData = await result.current.refetch();

    expect(refetchedData.data).toMatchObject({
      hello: { world: 'value' },
    });
  });

  it('fetches more data properly', async () => {
    const queryObservable = makeWatchQuery({
      client: apolloClient,
      queryFn: (client: ApolloClient<NormalizedCacheObject>) => {
        return client.query({
          query: exampleQuery,
        });
      },
      options: {
        query: exampleQuery,
      },
    });

    const { result } = renderHook(
      () => useApolloObservableQuery(queryObservable),
      {
        wrapper: ContainerWrapper,
      },
    );

    // test fetchMore works correctly
    const moreResults = await result.current.fetchMore({});

    expect(moreResults.data).toMatchObject({
      hello: { world: 'value' },
    });
  });
});

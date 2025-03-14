import React from 'react';
import {
  mockFetch,
  mockFetchBasedOnQuery,
  mockFetchWithDelay,
} from '@brainly-gene/core';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  useQuery,
} from '@apollo/client';
import gql from 'graphql-tag';
import { useApolloLazyQuery } from './useApolloLazyQuery';
import { waitFor, renderHook } from '@testing-library/react';

const query = `
  query GetSomething {
    hello {
      world
    }
  }
`;

const otherQuery = `
  query GetSomethingElse {
    hola {
      mundo
    }
  }
`;

const exampleQuery = gql(query);

const queryFn = (client: ApolloClient<NormalizedCacheObject>) => {
  return client.query({
    query: exampleQuery,
  });
};

describe('useApolloLazyQuery', () => {
  it('fetch data on demand with proper re-render cycle', async () => {
    mockFetch();
    const apolloClient = new ApolloClient({
      uri: 'https://mockurl.com',
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    const { result } = renderHook(() =>
      useApolloLazyQuery({
        apolloClient,
        queryFn,
      })
    );

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(undefined);

    result.current.fetch();

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

  it('should handle optimistic updates correctly', async () => {
    mockFetchWithDelay(500);
    const apolloClient = new ApolloClient({
      uri: 'https://mockurl.com',
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    const optimisticResponse = {
      data: {
        hello: 'optimistic',
      },
    };

    const { result } = renderHook(() =>
      useApolloLazyQuery({
        apolloClient,
        queryFn,
      })
    );

    result.current.fetch({ optimisticResponse });
    await waitFor(() => {
      expect(result.current.data).toMatchObject(optimisticResponse);
    });

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        hello: { world: 'value' },
      });
    });
  });

  it('should handle refetch queries correctly', async () => {
    mockFetchBasedOnQuery();
    const apolloClient = new ApolloClient({
      uri: 'https://mockurl.com',
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    const refetchQueries = ['GetSomethingElse'];

    const { result } = renderHook(() =>
      useApolloLazyQuery({
        apolloClient,
        queryFn,
      })
    );

    const { result: otherResult } = renderHook(() =>
      useQuery(gql(otherQuery), {
        client: apolloClient,
      })
    );

    // Fetch other query first
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        'https://mockurl.com',
        expect.objectContaining({
          body: JSON.stringify({
            operationName: 'GetSomethingElse',
            variables: {},
            query:
              'query GetSomethingElse {\n  hola {\n    mundo\n    __typename\n  }\n}\n',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(otherResult.current.data).toMatchObject({
        hola: { mundo: 'value' },
      });
    });

    result.current.fetch({ refetchQueries });

    // Fetch first query
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        'https://mockurl.com',
        expect.objectContaining({
          body: JSON.stringify({
            operationName: 'GetSomething',
            variables: {},
            query:
              'query GetSomething {\n  hello {\n    world\n    __typename\n  }\n}\n',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        hello: { world: 'value' },
      });
    });


    // Refetch the other query
    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        'https://mockurl.com',
        expect.objectContaining({
          body: JSON.stringify({
            operationName: 'GetSomethingElse',
            variables: {},
            query:
              'query GetSomethingElse {\n  hola {\n    mundo\n    __typename\n  }\n}\n',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });
});

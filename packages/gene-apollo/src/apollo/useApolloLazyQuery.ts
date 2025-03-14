import React from 'react';
import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client';
import { transformApolloResponse } from './transformApolloResponse';
import type { CommonFetchFn, CommonServiceType } from '@brainly-gene/core';

interface PropsType<TData, TVariables> {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  queryFn: (
    client: ApolloClient<NormalizedCacheObject>,
    variables: TVariables,
  ) => Promise<ApolloQueryResult<TData>>;
}

export function useApolloLazyQuery<TData, TVariables = Record<string, any>>({
  apolloClient,
  queryFn,
}: PropsType<TData, TVariables>) {
  const [queryResults, setQueryResults] = React.useState<
    Partial<CommonServiceType<TData, TVariables>>
  >({ data: undefined, loading: false, error: null });

  const fetch: CommonFetchFn<TData, TVariables> = React.useCallback(
    async (options) => {
      const { variables, optimisticResponse, refetchQueries, updates } =
        options || {};
      try {
        if (optimisticResponse) {
          setQueryResults({
            data: optimisticResponse,
            loading: false,
            error: null,
          });
        } else {
          setQueryResults((curr) => ({ ...curr, loading: true }));
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const apolloResponse = await queryFn(apolloClient, variables || {});

        const transformedData = transformApolloResponse<TData, TVariables>(
          apolloResponse,
        );

        setQueryResults(transformedData);

        if (refetchQueries) {
          apolloClient.refetchQueries({
            include: refetchQueries,
          });
        }

        if (updates) {
          console.error('Updates are not supported in useApolloLazyQuery');
        }

        return transformedData;
      } catch (e) {
        const transformedData = transformApolloResponse<TData, TVariables>({
          data: undefined,
          loading: false,
          error: {
            message: `${e}`,
          },
        } as unknown as ApolloQueryResult<TData>);

        setQueryResults(transformedData);

        return transformedData;
      }
    },
    [],
  );

  return React.useMemo(
    () => ({ ...queryResults, fetch }),
    [fetch, queryResults],
  );
}

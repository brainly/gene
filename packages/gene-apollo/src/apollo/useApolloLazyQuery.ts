import React from 'react';
import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
  RefetchQueriesInclude,
} from '@apollo/client';
import { transformApolloResponse } from './transformApolloResponse';
import {
  CommonFetchFn,
  CommonServiceType,
  FetchPropsType,
} from '@brainly-gene/core';

type PropsType<TData, TVariables> = {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  queryFn: (
    client: ApolloClient<NormalizedCacheObject>,
    variables: TVariables
  ) => Promise<ApolloQueryResult<TData>>;
};

export function useApolloLazyQuery<TData, TVariables = Record<string, any>>({
  apolloClient,
  queryFn,
}: PropsType<TData, TVariables>) {
  const [queryResults, setQueryResults] = React.useState<
    Partial<CommonServiceType<TData, TVariables>>
  >({ data: undefined, loading: false, error: null });

  const fetch: CommonFetchFn<TData, TVariables> = React.useCallback(
    async (options) => {
      const {
        variables,
        ignoreCache,
        optimisticResponse,
        refetchQueries,
        updates,
      } = options || {};
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
          apolloResponse
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
    []
  );

  return React.useMemo(
    () => ({ ...queryResults, fetch }),
    [fetch, queryResults]
  );
}
import React from 'react';
import { transformReactQueryResponse } from './transformReactQueryResponse';

import type {
  QueryClient,
  QueryKey,
  QueryObserverResult,
} from '@tanstack/react-query';
import type { CommonServiceType, CommonFetchFn } from '../services';

interface PropsType<TData, TVariables> {
  reactQueryClient: QueryClient;
  queryFn: (client: QueryClient, variables: TVariables) => Promise<TData>;
  queryKey: (variables?: TVariables) => QueryKey;
}

export function useReactQueryLazy<TData, TVariables = Record<string, any>>({
  reactQueryClient,
  queryFn,
  queryKey,
}: PropsType<TData, TVariables>) {
  const [queryResults, setQueryResults] = React.useState<
    Partial<CommonServiceType<TData, TVariables>>
  >({ data: undefined, loading: false, error: null });

  const fetch: CommonFetchFn<TData, TVariables, QueryKey> = React.useCallback(
    async (options) => {
      const {
        ignoreCache = false,
        variables = {} as TVariables,
        refetchQueries = [],
        updates = [],
        optimisticResponse,
      } = options || {};

      setQueryResults((curr) => ({ ...curr, loading: true }));

      // Snapshot the previous queries values
      const previousQueryValues = new Map();
      updates?.forEach(async ({ queryKey }) => {
        const previousData = reactQueryClient.getQueryData(queryKey);

        if (!previousData) {
          console.error(
            `Query key ${JSON.stringify(queryKey)} does not exist in cache`
          );
          return;
        }

        previousQueryValues.set(JSON.stringify(queryKey), previousData);
      });

      // Update queries with provided updaters
      const runQueryUpdates = (currentResult: TData | undefined) => {
        if (!currentResult) {
          revertQueryUpdates();
          return;
        }

        updates?.forEach(async ({ queryKey, updateFn }) => {
          await reactQueryClient.cancelQueries({ queryKey });
          reactQueryClient.setQueryData(queryKey, (queryData: any) => {
            if (!queryData) {
              console.error(
                `Query key ${JSON.stringify(queryKey)} does not exist in cache`
              );
              return queryData;
            }

            return updateFn(queryData, currentResult);
          });
        });
      };

      // Revert provided query data to snapshot value
      const revertQueryUpdates = () => {
        updates?.forEach(({ queryKey }) => {
          reactQueryClient.setQueryData(
            queryKey,
            previousQueryValues.get(JSON.stringify(queryKey))
          );
        });
      };

      if (optimisticResponse) {
        setQueryResults((curr) => ({
          ...curr,
          loading: false,
          data: optimisticResponse,
        }));

        runQueryUpdates(optimisticResponse);
      }

      try {
        const cachedResponse = reactQueryClient.getQueryData(
          queryKey(variables)
        );

        if (cachedResponse && !ignoreCache) {
          const transformedData = transformReactQueryResponse({
            data: cachedResponse,
          } as unknown as QueryObserverResult) as Partial<
            CommonServiceType<TData, TVariables>
          >;

          setQueryResults(transformedData);

          return Promise.resolve(transformedData);
        }

        const response = await queryFn(
          reactQueryClient,
          variables || ({} as TVariables)
        );

        const transformedData = transformReactQueryResponse({
          data: response,
        } as unknown as QueryObserverResult) as Partial<
          CommonServiceType<TData, TVariables>
        >;

        setQueryResults(transformedData);
        runQueryUpdates(transformedData.data);

        refetchQueries.forEach((queryKey) => {
          reactQueryClient.refetchQueries({
            queryKey,
          });
        });

        return Promise.resolve(transformedData);
      } catch (e: any) {
        const transformedData = transformReactQueryResponse({
          error: e?.data?.error || e,
          data: e?.data,
          isLoading: false,
        } as unknown as QueryObserverResult) as Partial<
          CommonServiceType<TData, TVariables>
        >;

        setQueryResults(transformedData);
        revertQueryUpdates();
        return Promise.reject(transformedData);
      }
    },
    [queryFn, queryKey, reactQueryClient]
  );

  return React.useMemo(
    () => ({ ...queryResults, fetch }),
    [fetch, queryResults]
  );
}

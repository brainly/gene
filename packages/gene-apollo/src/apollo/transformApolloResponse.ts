import type { ApolloQueryResult, QueryResult } from '@apollo/client';
import type { CommonServiceType } from '@brainly-gene/core';

export function transformApolloResponse<TData = null, TVariables = null>(
  response: ApolloQueryResult<TData> | QueryResult<TData> | undefined
): Partial<CommonServiceType<TData, TVariables>> {
  if (!response) {
    return {
      data: undefined,
      loading: false,
      error: null,
    };
  }

  const fetchMore =
    'fetchMore' in response
      ? async (variables: TVariables) => {
          response.fetchMore<TData, TVariables>({ variables });
        }
      : undefined;

  const refetch =
    'refetch' in response
      ? async (variables: TVariables) => {
          response.refetch({ variables });
        }
      : undefined;

  return {
    error: response.error?.message || null,
    data: response.data,
    loading: !!response.loading,
    fetchMore,
    refetch,
  };
}

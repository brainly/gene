import {
  InfiniteQueryObserverResult,
  QueryObserverResult,
  UseQueryResult,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { CommonServiceType } from '../services';

export function transformReactQueryResponse<TData = null, TVariables = null>(
  response:
    | InfiniteQueryObserverResult<TData>
    | QueryObserverResult<TData>
    | UseQueryResult<TData>
    | UseInfiniteQueryResult<TData>
    | undefined
): Partial<CommonServiceType<TData, TVariables>> {
  if (!response) {
    return {
      data: undefined,
      loading: false,
      error: null,
    };
  }

  const fetchMore =
    'fetchNextPage' in response
      ? async () => {
          response.fetchNextPage();
        }
      : undefined;

  const fetchPreviousPage =
    'fetchPreviousPage' in response
      ? async () => {
          response.fetchPreviousPage();
        }
      : undefined;

  const refetch = async () => {
    response.refetch();
  };

  const hasMore = 'hasNextPage' in response ? response.hasNextPage : undefined;

  return {
    error: response.error || null,
    data: response.data,
    loading: !!response.isLoading,
    fetchMore,
    fetchPreviousPage,
    hasMore,
    refetch,
  };
}

import {CommonServiceType} from './types';

export function getDefaultServiceResponse<T, TVariables>(
  response?: Partial<CommonServiceType<T, TVariables>>
): CommonServiceType<T, TVariables> {
  return {
    data: undefined,
    loading: false,
    error: null,
    refetch: () => Promise.resolve(undefined),
    fetchMore: () => Promise.resolve(undefined),
    fetchPreviousPage: () => Promise.resolve(undefined),
    hasMore: false,
    ...(response ? response : {}),
  };
}

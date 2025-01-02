export interface CommonServiceType<
  T,
  TVariables = Record<string, any>,
  TRefetch = (variables: TVariables) => Promise<void>,
  TFetchMore = (variables: TVariables) => Promise<void>,
  TFetchPreviousPage = (variables: TVariables) => Promise<void>
> {
  loading: boolean;
  error: Error | string | null;
  data: T | undefined;
  refetch: TRefetch;
  fetchMore?: TFetchMore;
  fetchPreviousPage?: TFetchPreviousPage;
  hasMore?: boolean;
}

export interface FetchPropsType<TData, TVariables, TQueryKey> {
  ignoreCache?: boolean;
  variables?: TVariables;
  refetchQueries?: TQueryKey[];
  optimisticResponse?: TData;
  updates?: {
    queryKey: TQueryKey;
    updateFn: (queryData: any, currentQueryResponse: TData) => any;
  }[];
}

export type CommonFetchFn<
  TData,
  TVariables = Record<string, any>,
  TQueryKey = string
> = (
  args?: FetchPropsType<TData, TVariables, TQueryKey>
) => Promise<Partial<CommonServiceType<TData, TVariables>>>;

import type { QueryClient, QueryFunctionContext } from '@tanstack/react-query';
import { reactQueryFetchWrapper } from '@brainly-gene/core';
import nodeFetch from 'node-fetch';

export type MyDataDataTypeAPI = {
  title: string;
};
export type VariablesType = {
  id: number
};

export const queryKey = (variables?: VariablesType) => [
  'myData-key',
  variables,
];

export function queryFn(
  variables?: VariablesType,
  context?: QueryFunctionContext
) {
  const url = `https://jsonplaceholder.typicode.com/todos/${variables.id}`;
  const fetchMethod = typeof window === 'undefined' ? nodeFetch : fetch;
  return reactQueryFetchWrapper<MyDataDataTypeAPI>(() => fetchMethod(url));
}

export async function queryMyData(
  client: QueryClient,
  variables: VariablesType
) {
  return client.fetchQuery({
    queryFn: () => queryFn(variables),
    queryKey: queryKey(variables),
  });
}

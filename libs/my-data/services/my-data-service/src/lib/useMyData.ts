import { queryFn, queryKey, VariablesType } from './queries';
import {
  transformReactQueryResponse,
  useInjectedReactQueryClient,
} from '@brainly-gene/core';
import { useQuery } from '@tanstack/react-query';

export function useMyData(props?: { variables: VariablesType }) {
  const queryClient = useInjectedReactQueryClient();

  // useInfiniteQuery if paging is needed
  const result = useQuery(
    {
      queryKey: queryKey(props?.variables),
      queryFn: (ctx) => queryFn(props?.variables, ctx),
    },
    queryClient,
  );

  return transformReactQueryResponse(result);
}

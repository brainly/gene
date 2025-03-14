import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { Factory } from '@brainly-gene/core';
import { useInjection, ServiceTypes } from '@brainly-gene/core';

export function useInjectedApolloClient() {
  try {
    return useInjection<Factory<ApolloClient<NormalizedCacheObject>>>(
      'serviceFactory'
    )(ServiceTypes.apollo)({});
  } catch (e) {
    throw new Error(
      `${e}. This may happen if you forget to inject apollo client in the "[...]Ioc.ts" file`
    );
  }
}

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Factory } from '@brainly/gene';
import { useInjection } from '@brainly/gene';
import { ServiceTypes } from '@brainly/gene';

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

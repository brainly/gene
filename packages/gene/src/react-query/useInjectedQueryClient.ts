import { QueryClient } from '@tanstack/react-query';

import { useInjection } from '../ioc';
import { ServiceTypes } from '../services';
import { Factory } from '../utils';

export function useInjectedReactQueryClient(): QueryClient {
  return useInjection<Factory>('serviceFactory')(ServiceTypes.reactQuery)(
    {}
  ) as QueryClient;
}

import { useHrefRewrite } from '../rewrites';
import React from 'react';

export function useGenerator() {
  const { translateRoute, getRedirect, originUrl } = useHrefRewrite();

  const generate = React.useCallback(
    (route: string) => {
      const [pathname, searchParams] = route.split('?');
      const rewrite = translateRoute(pathname || '');
      const redirect = getRedirect(pathname || '');

      const url = rewrite || redirect || originUrl + route;

      if (searchParams) {
        return url + `?${searchParams}`;
      }

      return url;
    },
    [translateRoute, originUrl, getRedirect]
  );

  return generate;
}

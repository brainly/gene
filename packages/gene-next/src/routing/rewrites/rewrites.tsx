/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import React, { useContext, useMemo } from 'react';
import { match, compile } from 'path-to-regexp';

interface LinkRewritesService {
  originUrl: string;
  translateRoute(path: string): string | null;
  getRedirect(path: string): string | null;
}

const LinkRewriteContext = React.createContext<LinkRewritesService | null>(
  null,
);

interface Rewrite {
  source: string;
  destination: string;
}

interface Redirect {
  source: string;
  destination: string;
}

interface PropsType {
  rewrites: Rewrite[];
  redirects: Redirect[];
  originUrl: string;
  children: React.ReactNode;
}

export function LinkRewriteContextProvider(props: PropsType) {
  const { rewrites, redirects, originUrl, children } = props;

  const parsedRewrites = useMemo(() => parseRewrites(rewrites), [rewrites]);

  const parsedRedirects = useMemo(() => parseRedirects(redirects), [redirects]);

  const service = useMemo(
    (): LinkRewritesService => ({
      originUrl,
      translateRoute(href: string) {
        // TODO: This function could be memoized with LRU cache

        for (const rule of parsedRewrites) {
          const matchResult = rule.matchFn(href);

          if (matchResult) {
            const relativePath = rule.compileFn(matchResult.params);
            return originUrl + relativePath;
          }
        }

        return null;
      },
      getRedirect(href: string) {
        for (const rule of parsedRedirects) {
          const matchResult = rule.matchFn(href);

          if (matchResult) {
            return rule.compileFn(matchResult.params);
          }
        }

        return null;
      },
    }),
    [parsedRewrites, parsedRedirects, originUrl],
  );

  return (
    <LinkRewriteContext.Provider value={service}>
      {children}
    </LinkRewriteContext.Provider>
  );
}

export function useHrefRewrite() {
  const service = useContext(LinkRewriteContext);

  if (!service) {
    throw new Error('LinkRewriteContext is missing');
  }

  return service;
}

function parseRewrites(rewrites: Rewrite[]) {
  return rewrites.map((rewrite) => {
    return {
      matchFn: match(rewrite.destination, { decode: decodeURIComponent }),
      compileFn: compile(rewrite.source, { encode: encodeURIComponent }),
    };
  });
}

function parseRedirects(redirects: Rewrite[]) {
  return redirects.map((redirect) => {
    const { origin, pathname } = new URL(redirect.destination);

    return {
      matchFn: match(redirect.source, { decode: decodeURIComponent }),
      compileFn: (data: any) =>
        origin + compile(pathname, { encode: encodeURIComponent })(data),
    };
  });
}

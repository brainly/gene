import { Container } from 'inversify';

import type { Router, RouterEvent } from './types';
import { Observable } from 'zen-observable-ts';
import type { RouterIocType } from './ioc';
import { ROUTER_SERVICE_IDENTIFIER } from './ioc';

const baseRouterMock: Router = {
  openInNewTab: () => null,
  pathname: 'https://example.com/',
  query: {},
  basePath: '',
  asPath: '',
  navigate: () => null,
  replace: () => null,
  assign: () => null,
  reload: () => null,
  generate: (path) => path,
  $routeChanged: new Observable<RouterEvent>(() => undefined),
  back: () => null,
};

export function getMockRouter(routerMock: Partial<Router> = {}): Router {
  return {
    ...baseRouterMock,
    ...routerMock,
  };
}

export function useMockedRouterContainer(routerMock: Partial<Router> = {}) {
  const mockedRouterContainer = new Container();
  const router = getMockRouter(routerMock);

  mockedRouterContainer
    .bind<RouterIocType>(ROUTER_SERVICE_IDENTIFIER)
    .toFunction(() => router);

  return mockedRouterContainer;
}

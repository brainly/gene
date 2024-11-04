import { Container } from 'inversify';
import { useTransformedNextRouter } from '../routing';
import {
  ROUTER_SERVICE_IDENTIFIER,
  Router,
  RouterIocType,
} from '@brainly/gene';

export const NEXT_ROUTER = Symbol.for('nextRouter');

type RoutersType = typeof NEXT_ROUTER;

const routers = new Map([[NEXT_ROUTER, () => useTransformedNextRouter()]]);

function getRouter(router: RoutersType): () => Router {
  return routers.get(router) || (() => useTransformedNextRouter());
}

export function getRouterContainer(router: RoutersType) {
  const brainlyRouterContainer = new Container();

  brainlyRouterContainer
    .bind<RouterIocType>(ROUTER_SERVICE_IDENTIFIER)
    .toFunction(getRouter(router));

  return brainlyRouterContainer;
}

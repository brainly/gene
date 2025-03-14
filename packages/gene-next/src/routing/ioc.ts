import { Container } from 'inversify';
import { useTransformedNextRouter } from '../routing';
import type {
  Router,
  RouterIocType} from '@brainly-gene/core';
import {
  ROUTER_SERVICE_IDENTIFIER
} from '@brainly-gene/core';

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

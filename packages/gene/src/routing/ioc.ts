import { Router } from './types';

export type RouterIocType = () => Router;

export const ROUTER_SERVICE_IDENTIFIER = Symbol.for('router');

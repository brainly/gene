import nc, {type NextConnect, type Options} from 'next-connect';
import type {NextApiRequest, NextApiResponse} from 'next';
import type {IncomingMessage, ServerResponse} from 'http';

/**
 * @description
 * Wrapper for aggregator for handlers and middlewares
 * Uses NC so far
 */
export function apiHandlerConnect<
  TRequest extends NextApiRequest,
  TResponse extends NextApiResponse
>(
  options?: Options<IncomingMessage, ServerResponse>
): NextConnect<TRequest, TResponse> {
  return nc<TRequest, TResponse>({
    ...options,
    disableResponseWait: true,
  } as Options<TRequest, TResponse>);
}

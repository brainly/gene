import type { IncomingMessage } from 'http';

/**
 *
 * @description Get the origin URL of your Next.js app (and optionally set a dev url)
 * @param headers Headers obtained from request in getServerSideProps
 * @param localhostAddress Dev url
 */
export function getOriginURL(
  headers?: Record<string, string | string[]>,
  localhostAddress = 'localhost:4200',
): URL {
  let host = localhostAddress;
  if (headers && headers.host && typeof headers.host === 'string') {
    host = headers.host;
  } else if (typeof window !== 'undefined' && window.location.host) {
    host = window.location.host;
  }

  let protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:';

  if (host === 'localhost:3000') {
    // localhost 3000 is our https address for local development
    protocol = 'https:';
  }

  if (
    headers &&
    headers['x-forwarded-host'] &&
    typeof headers['x-forwarded-host'] === 'string'
  ) {
    host = headers['x-forwarded-host'];
  }

  if (
    headers &&
    headers['x-forwarded-proto'] &&
    typeof headers['x-forwarded-proto'] === 'string'
  ) {
    protocol = `${headers['x-forwarded-proto']}:`;
  }

  return new URL(protocol + '//' + host);
}

const ALLOWED_HEADERS = [
  'host',
  'x-forwarded-host',
  'x-forwarded-proto',
  'user-agent',
  'accept',
];

export function getRequestHeaders(request?: IncomingMessage) {
  return Object.fromEntries(
    ALLOWED_HEADERS.map((key) => [key, request?.headers[key] || null]),
  );
}

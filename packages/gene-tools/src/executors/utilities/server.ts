import { logger } from '@nx/devkit';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { createServer } from 'http-proxy';
import Server = require('http-proxy');
import { join, resolve } from 'path';

export interface ServeOptions {
  host: string;
  port: number;
  serveTarget: string;
  targetHost: string;
  targetPort: number;
  noOutput: boolean;
}

export function createProxy({
  host,
  port,
  targetHost,
  targetPort,
}: ServeOptions): Server | null {
  let server = null;

  try {
    server = createServer({
      target: { host: targetHost, port: targetPort },
      ssl: {
        key: readFileSync(resolve('certs', 'server.key'), 'utf8'),
        cert: readFileSync(resolve('certs', 'server.crt'), 'utf8'),
      },
    })
      .on('error', function (e: any) {
        logger.error(
          chalk.red(
            `${chalk.green('[PROXY]')} Request failed: ${chalk.bold(e.code)}`
          )
        );
      })
      .listen(port);
  } catch (e) {
    logger.error(`${chalk.bold('[PROXY]')} Failed to initialize the proxy`);
    throw e;
  }

  logger.info(
    `${chalk.green(
      '[PROXY]'
    )} Started https://${host}:${port} → http://${targetHost}:${targetPort}`
  );

  return server;
}

import type { ExecutorContext, Target } from '@nx/devkit';
import { logger, parseTargetString, runExecutor } from '@nx/devkit';

import type { ServeOptions } from '../utilities/server';
import { createProxy } from '../utilities/server';
import Server = require('http-proxy');

export type serveExecutorOptions = {
  serve: string;
  serveOptions: Record<string, string>;
  e2eTests: string[];
  watch: boolean;
  proxy?: boolean;
} & ServeOptions;

const runTests = async ({
  e2eTestsTarget,
  context,
  watch,
}: {
  e2eTestsTarget: Target;
  context: ExecutorContext;
  watch: boolean;
}) => {
  let success = false;
  for await (const resultInner of await runExecutor(
    e2eTestsTarget,
    {
      watch,
    },
    context,
  )) {
    success = resultInner.success;

    if (success) {
      return { success: true };
    }

    return { success: false };
  }

  return { success: true };
};

const shutDownAfterTests = (
  server: Server | undefined,
  childProcess?: { kill?: () => void },
) => {
  if (server) {
    server.close();
  }

  if (childProcess && childProcess.kill) {
    childProcess.kill(); // kill e2e storybook after tests
  }
};

export async function e2eAppTestsExecutor(
  options: serveExecutorOptions,
  context: ExecutorContext,
) {
  const serveTarget = parseTargetString(options.serve);
  const e2eTestsTargets = options.e2eTests.map(parseTargetString);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (options.cypressConfig) {
    throw new Error(
      'cannot use cypressConfig as a cli flag. Declare cypressConfig in project.json',
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  for await (const { success: serveSuccess, childProcess } of await runExecutor(
    serveTarget,
    options.serveOptions || {},
    context,
  )) {
    if (!serveSuccess) {
      logger.error(
        `Failed to run target ${serveTarget.target} for project ${serveTarget.project}`,
      );
      return { success: false };
    }

    let server;
    if (options.proxy !== false) {
      server = createProxy(options);
      if (!server) {
        logger.error(`No server running on host ${options.host}`);
        return { success: false };
      }
    }

    for (const e2eTestsTarget of e2eTestsTargets) {
      const { success: e2eSuccess } = await runTests({
        e2eTestsTarget,
        context,
        watch: options.watch,
      });

      if (!e2eSuccess) {
        shutDownAfterTests(server, childProcess);
        return { success: false };
      }
    }

    shutDownAfterTests(server, childProcess);
    return { success: true };
  }

  return { success: true };
}

export default e2eAppTestsExecutor;

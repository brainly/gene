import type { ExecutorContext } from '@nx/devkit';
import { parseTargetString, runExecutor } from '@nx/devkit';

import type { ServeOptions } from '../utilities/server';
import { createProxy } from '../utilities/server';

export type SecureServeExecutorOptions = ServeOptions;

export async function secureServeExecutor(
  options: SecureServeExecutorOptions,
  context: ExecutorContext,
) {
  let success = false;
  const target = parseTargetString(options.serveTarget, context);

  for await (const result of await runExecutor(target, {}, context)) {
    success = result.success;
    if (!success) {
      break;
    }
    createProxy(options);
  }

  return { success };
}

export default secureServeExecutor;

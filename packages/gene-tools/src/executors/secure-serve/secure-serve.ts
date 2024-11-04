import { ExecutorContext, parseTargetString, runExecutor } from '@nrwl/devkit';

import { createProxy, ServeOptions } from '../utilities/server';

export type SecureServeExecutorOptions = ServeOptions;

export async function secureServeExecutor(
  options: SecureServeExecutorOptions,
  context: ExecutorContext
) {
  let success = false;
  const target = parseTargetString(options.serveTarget);

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

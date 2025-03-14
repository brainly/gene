import type { ExecutorContext } from '@nx/devkit';
import { detectPackageManager } from '@nx/devkit';

import { spawn } from 'child_process';

export interface SecureServeExecutorOptions {
  command: 'start' | 'build';
  e2e?: boolean;
}

export async function storybookExecutor(
  options: SecureServeExecutorOptions,
  context: ExecutorContext,
) {
  if (!context.projectName) {
    return {
      success: false,
    };
  }

  const target =
    options.command === 'build' ? 'build-nrwl-storybook' : 'nrwl-storybook';

  const packageManager = detectPackageManager();

  const childProcess = spawn(
    packageManager,
    ['nx', 'run', `${context.projectName}:${target}`],
    {
      env: { ...process.env, NODE_OPTIONS: '--openssl-legacy-provider' },
      shell: true,
    },
  );

  let success = false;
  await new Promise<void>((resolve, reject) => {
    childProcess.stdout?.on('data', (data) => {
      if (!data.toString().includes('loose')) {
        // silent babel warning
        console.log(data.toString());
      }

      if (options.e2e && data.toString().includes('started')) {
        success = true;
        resolve();
      }
    });

    childProcess.stderr?.on('error', (data) => {
      console.error(data.toString());
    });
    childProcess.on('close', (code) => {
      success = code === 0;
      resolve();
    });
    childProcess.on('error', (error) => {
      console.error('Spawn error:', error);
      reject();
    });
  });

  return {
    success,
    childProcess,
  };
}

export default storybookExecutor;

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  runExecutor: jest.fn(),
}));
jest.mock('http-proxy');

import { ExecutorContext, logger, runExecutor } from '@nx/devkit';

import { createServer } from 'http-proxy';
import {
  secureServeExecutor,
  SecureServeExecutorOptions,
} from './secure-serve';

describe('secureServe executor', () => {
  const options: SecureServeExecutorOptions = {
    host: 'localhost',
    port: 3000,
    serveTarget: 'foo:bar',
    targetHost: 'localhost',
    targetPort: 4200,
    noOutput: false,
  };
  const context = {} as ExecutorContext;

  beforeEach(() => {
    jest.clearAllMocks();

    (runExecutor as jest.Mock).mockImplementation(() => [{ success: true }]);
    (createServer as jest.Mock).mockImplementation(() => ({
      on: () => ({ listen: jest.fn() }),
    }));
    jest.spyOn(logger, 'info').mockImplementation();
    jest.spyOn(logger, 'error').mockImplementation();
  });

  it('should fail fast when the application serve fails', async () => {
    (runExecutor as jest.Mock).mockImplementation(() => [{ success: false }]);

    const result = await secureServeExecutor(options, context);

    expect(result.success).toBe(false);
    expect(createServer).not.toHaveBeenCalled();
  });

  it('should throw an error when the proxy fails to initialize', async () => {
    (createServer as jest.Mock).mockImplementation(() => {
      throw new Error('Something went wrong');
    });

    await expect(
      async () => await secureServeExecutor(options, context)
    ).rejects.toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to initialize the proxy')
    );
  });

  it('should start application and proxy successfully', async () => {
    const result = await secureServeExecutor(options, context);

    expect(result.success).toBe(true);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        `Started https://${options.host}:${options.port} → http://${options.targetHost}:${options.targetPort}`
      )
    );
    expect(runExecutor).toHaveBeenCalled();
    expect(createServer).toHaveBeenCalled();
  });
});

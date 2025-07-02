import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import apiRouteGenerator from './index';
import { prompt } from 'inquirer';
import { applicationGenerator } from '@nx/next';

jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

jest.setTimeout(30000); // NX fetches @nx/playwright with package manager during tests (to be mocked)

describe('Subapp generator', () => {
  let appTree: Tree;
  let apiRouteName: string;
  let appDirectory: string;
  let appName: string;
  let apiPath: string;

  beforeEach(async () => {
    jest.spyOn(logger, 'warn').mockImplementation(() => jest.fn());
    jest.spyOn(logger, 'debug').mockImplementation(() => jest.fn());

    apiRouteName = 'my-api-route';
    appDirectory = 'apps/example.com';
    appName = 'example.com';
    apiPath = 'v1';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    await applicationGenerator(appTree, {
      directory: appDirectory,
      name: appName,
      style: 'none',
    });

    (prompt as unknown as jest.Mock).mockImplementationOnce(([{ name }]) => {
      if (name === 'appName') {
        return { appName };
      }
    });
    await new Promise(process.nextTick);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate files', async () => {
    await apiRouteGenerator(appTree, {
      name: apiRouteName,
      directory: apiPath,
      addCors: false,
      wrapWithSentry: false,
    });

    expect(
      appTree.exists(`${appDirectory}/pages/api/${apiPath}/my-api-route.ts`)
    ).toBeTruthy();
  });

  it('should wrap route with sentry', async () => {
    await apiRouteGenerator(appTree, {
      name: apiRouteName,
      directory: apiPath,
      addCors: false,
      wrapWithSentry: true,
    });

    const routeContent = appTree
      .read(`${appDirectory}/pages/api/${apiPath}/my-api-route.ts`)
      ?.toString();
    expect(routeContent).toContain('export default wrapApiHandlerWithSentry');
  });

  it('should add cors options', async () => {
    await apiRouteGenerator(appTree, {
      name: apiRouteName,
      directory: apiPath,
      addCors: true,
      wrapWithSentry: false,
    });

    const routeContent = appTree
      .read(`${appDirectory}/pages/api/${apiPath}/my-api-route.ts`)
      ?.toString();
    expect(routeContent).toContain(`credentials: true`);
  });
});

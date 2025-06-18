import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import apiRouteGenerator from './index';
import { prompt } from 'inquirer';
import { applicationGenerator } from '@nx/next';

jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

jest.setTimeout(10000);

describe('Subapp generator', () => {
  let appTree: Tree;
  let apiRouteName: string;
  let appDirectory: string;
  let appName: string;
  let apiPath: string;

  beforeEach(async () => {
    apiRouteName = 'my-api-route';
    appDirectory = 'apps/example.com';
    appName = 'example.com';
    apiPath = 'v1';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);

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

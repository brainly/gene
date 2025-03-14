import { logger, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import apiRouteGenerator from './index';
import { prompt } from 'inquirer';
import { applicationGenerator } from '@nx/next';
jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

describe('Subapp generator', () => {
  let appTree: Tree;
  let apiRouteName: string;

  beforeEach(async () => {
    apiRouteName = 'my-api-route';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);

    await applicationGenerator(appTree, {
      directory: 'example.com',
      name: 'us',
      style: 'none',
    });

    (prompt as unknown as jest.Mock).mockImplementationOnce(
      ([{ name }]) => {
        if (name === 'appName') {
          return { appName: 'example.com-us' };
        }
      }
    );
  });

  it('should generate files', async () => {
    await apiRouteGenerator(appTree, {
      name: apiRouteName,
      directory: 'v1',
      addCors: false,
      wrapWithSentry: false,
    });

    expect(
      appTree.exists('apps/example.com/us/pages/api/v1/my-api-route.ts')
    ).toBeTruthy();
  });

  it('should wrap route with sentry', async () => {
    await apiRouteGenerator(appTree, {
      name: apiRouteName,
      directory: 'v1',
      addCors: false,
      wrapWithSentry: true,
    });

    const routeContent = appTree
      .read('apps/example.com/us/pages/api/v1/my-api-route.ts')
      ?.toString();
    expect(routeContent).toContain('export default wrapApiHandlerWithSentry');
  });

  it('should add cors options', async () => {
    await apiRouteGenerator(appTree, {
      name: apiRouteName,
      directory: 'v1',
      addCors: true,
      wrapWithSentry: false,
    });

    const routeContent = appTree
      .read('apps/example.com/us/pages/api/v1/my-api-route.ts')
      ?.toString();
    expect(routeContent).toContain(`credentials: true`);
  });
});

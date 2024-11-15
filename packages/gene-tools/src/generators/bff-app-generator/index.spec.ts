import { logger, readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import appGenerator from './index';

describe('NextJS App generator', () => {
  let appTree: Tree;
  let projectName: string;

  beforeEach(async () => {
    projectName = 'my-app';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate files', async () => {
    await appGenerator(appTree, {
      directory: '',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    expect(appTree.exists('apps/my-app/types/types.ts')).toBeTruthy();
    expect(appTree.exists('apps/my-app/config/rewrites.json')).toBeTruthy();
    expect(appTree.exists('apps/my-app/loadRewrites.js')).toBeTruthy();
    expect(appTree.exists('apps/my-app/withNodeModulesCSS.js')).toBeTruthy();
    expect(appTree.exists('apps/my-app/.storybook/main.js')).toBeTruthy();
    expect(appTree.exists('apps/my-app/.env')).toBeTruthy();
    expect(appTree.exists('apps/my-app/index.d.ts')).toBeTruthy();
    expect(appTree.exists('apps/my-app/next.config.js')).toBeTruthy();
    expect(appTree.exists('apps/my-app/README.md')).toBeTruthy();
    expect(appTree.exists('apps/my-app/tsconfig.json')).toBeTruthy();
    expect(appTree.exists('apps/my-app/tsconfig.spec.json')).toBeTruthy();
    expect(appTree.exists('apps/my-app-e2e/cypress.config.ts')).toBeTruthy();
    expect(
      appTree.exists('apps/my-app-e2e/src/fixtures/example.json')
    ).toBeTruthy();
    expect(appTree.exists('apps/my-app-e2e/src/support/e2e.ts')).toBeTruthy();
    expect(
      appTree.exists('apps/my-app-e2e/src/e2e/Home/display.ts')
    ).toBeTruthy();
    expect(appTree.exists('apps/my-app-e2e/src/e2e/Home.feature')).toBeTruthy();
  });

  it('should update workspace targets', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });
    
    const appConfig = readProjectConfiguration(appTree, 'example.com-my-app');

    expect(appConfig?.targets?.['build']).toBeTruthy();
    expect(appConfig?.targets?.['serve-base']).toBeTruthy();
    expect(appConfig?.targets?.['serve']).toBeTruthy();
    expect(appConfig?.targets?.['storybook']).toBeTruthy();
    expect(appConfig?.targets?.['build-storybook']).toBeTruthy();
    expect(appConfig?.targets?.['copy-translations-to-app']).toBeTruthy();
    expect(appConfig?.targets?.['copy-assets-to-app']).toBeTruthy();

    expect(
      appConfig?.targets?.['serve']?.dependsOn?.find(
        (item: any) => item.target === 'copy-translations-to-app'
      )
    ).toEqual({ target: 'copy-translations-to-app', projects: 'self' });

    expect(
      appConfig?.targets?.['serve']?.dependsOn?.find(
        (item: any) => item.target === 'copy-assets-to-app'
      )
    ).toEqual({ target: 'copy-assets-to-app', projects: 'self' });

    expect(
      appConfig?.targets?.['serve']?.dependsOn?.find(
        (item: any) => item.target === 'copy-translations-to-app'
      )
    ).toEqual({ target: 'copy-translations-to-app', projects: 'self' });

    expect(
      appConfig?.targets?.['serve-base']?.dependsOn?.find(
        (item: any) => item.target === 'copy-assets-to-app'
      )
    ).toEqual({ target: 'copy-assets-to-app', projects: 'self' });

    expect(
      appConfig?.targets?.['build']?.dependsOn?.find(
        (item: any) => item.target === 'copy-translations-to-app'
      )
    ).toEqual({ target: 'copy-translations-to-app', projects: 'self' });

    expect(
      appConfig?.targets?.['build']?.dependsOn?.find(
        (item: any) => item.target === 'copy-assets-to-app'
      )
    ).toEqual({ target: 'copy-assets-to-app', projects: 'self' });
    const e2eConfig = readProjectConfiguration(
      appTree,
      'example.com-example.com-my-app-e2e'
    );
    expect(e2eConfig?.targets?.['e2e']).toBeTruthy();
    expect(e2eConfig?.targets?.['e2e-base']).toBeTruthy();
  });

  it('should update cypress configs', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const cypressConfig = appTree
      .read('apps/example.com/my-app-e2e/cypress.config.ts')
      ?.toString();

    const baseUrl = 'https://localhost:3000';

    expect(cypressConfig).toContain(baseUrl);
    expect(cypressConfig).toContain('retries: 2');
  });

  it('should exclude files', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: false,
    });

    expect(
      appTree.exists('apps/example.com/my-app/config/rewrites.json')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/support/app.po.ts')
    ).not.toBeTruthy();
    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/e2e/app.spec.ts')
    ).not.toBeTruthy();
    expect(
      appTree.exists('apps/example.com/my-app-e2e/specs/index.spec.tsx')
    ).not.toBeTruthy();
  });

  it('should render without e2e files', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: false,
      e2e: false,
    });

    expect(
      appTree.exists('apps/example.com/my-app-e2e/config/rewrites.json')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/support/app.po.ts')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/e2e/app.spec.ts')
    ).not.toBeTruthy();
    expect(
      appTree.exists('apps/example.com/my-app-e2e/specs/index.spec.tsx')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/cypress.config.ts')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/fixtures/example.json')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/support/commands.ts')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/support/e2e.ts')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/e2e/Home/display.ts')
    ).not.toBeTruthy();

    expect(
      appTree.exists('apps/example.com/my-app-e2e/src/e2e/Home.feature')
    ).not.toBeTruthy();
  });

  it('.eslintrc should contain rootDir setting', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const appDir = `apps/example.com/my-app`;
    const eslintJSON = readJson(appTree, `${appDir}/.eslintrc.json`);
    expect(eslintJSON.settings.next.rootDir).toBe(appDir);
  });

  it('should generate files with both service clients', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const containerContent = appTree
      .read('apps/example.com/my-app/ioc/getHomePageIoc.ts')
      ?.toString();

    expect(containerContent).toContain('apolloClient.getClient()');
    expect(containerContent).toContain('queryClient.getClient()');

    const typesContent = appTree
      .read('apps/example.com/my-app/types/types.ts')
      ?.toString();

    expect(typesContent).toContain(
      'dehydratedApolloClient?: NormalizedCacheObject'
    );
    expect(typesContent).toContain('dehydratedQueryClient?: DehydratedState');
  });

  it('should generate files without service clients', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: false,
      name: projectName,
      reactQuery: false,
      rewrites: true,
    });

    const containerContent = appTree
      .read('apps/example.com/my-app/ioc/getHomePageIoc.ts')
      ?.toString();

    expect(containerContent).not.toContain('apolloClient.getClient()');
    expect(containerContent).not.toContain('queryClient.getClient()');

    const typesContent = appTree
      .read('apps/example.com/my-app/types/types.ts')
      ?.toString();

    expect(typesContent).not.toContain(
      'dehydratedApolloClient?: NormalizedCacheObject'
    );
    expect(typesContent).not.toContain(
      'dehydratedQueryClient?: DehydratedState'
    );
  });

  it('should generate files with only apollo service client', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: false,
      rewrites: true,
    });

    const containerContent = appTree
      .read('apps/example.com/my-app/ioc/getHomePageIoc.ts')
      ?.toString();

    expect(containerContent).toContain('apolloClient.getClient()');
    expect(containerContent).not.toContain('queryClient.getClient()');

    const typesContent = appTree
      .read('apps/example.com/my-app/types/types.ts')
      ?.toString();

    expect(typesContent).toContain(
      'dehydratedApolloClient?: NormalizedCacheObject'
    );
    expect(typesContent).not.toContain(
      'dehydratedQueryClient?: DehydratedState'
    );
  });

  it('should generate files only with react query service client', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: false,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const containerContent = appTree
      .read('apps/example.com/my-app/ioc/getHomePageIoc.ts')
      ?.toString();

    expect(containerContent).not.toContain('apolloClient.getClient()');
    expect(containerContent).toContain('queryClient.getClient()');

    const typesContent = appTree
      .read('apps/example.com/my-app/types/types.ts')
      ?.toString();

    expect(typesContent).not.toContain(
      'dehydratedApolloClient?: NormalizedCacheObject'
    );
    expect(typesContent).toContain('dehydratedQueryClient?: DehydratedState');
  });

  it('should create tags in workspace', async () => {
    await appGenerator(appTree, {
      directory: 'example.com',
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
      tags: 'test:tag,second:tag',
    });

    const appConfig = readProjectConfiguration(appTree, 'example.com-my-app');
    expect(appConfig.tags).toEqual(['type:app', 'test:tag', 'second:tag']);
  });
});

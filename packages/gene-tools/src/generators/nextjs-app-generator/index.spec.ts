import type { Tree } from '@nx/devkit';
import { logger, readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import appGenerator from './index';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';

jest.setTimeout(10000);

describe('NextJS App generator', () => {
  let appTree: Tree;
  let projectName: string;
  let directory: string;

  beforeEach(async () => {
    jest.spyOn(logger, 'warn').mockImplementation(() => jest.fn());
    jest.spyOn(logger, 'debug').mockImplementation(() => jest.fn());

    projectName = 'my-app';
    directory = 'apps/example/my-app';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate files structure', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    expect(nxFileTreeSnapshotSerializer(appTree)).toMatchInlineSnapshot(`
      ".prettierrc
      package.json
      nx.json
      tsconfig.base.json
      apps
      ├── .gitignore
      └── example
          ├── my-app
          │   ├── index.d.ts
          │   ├── next-env.d.ts
          │   ├── next.config.js
          │   ├── public
          │   │   ├── .gitkeep
          │   │   ├── favicon.ico
          │   │   └── nx-static
          │   │       ├── .gitignore
          │   │       └── manifest.json
          │   ├── tsconfig.json
          │   ├── pages
          │   │   ├── index.tsx
          │   │   ├── _app.tsx
          │   │   ├── _document.tsx
          │   │   ├── styles.css
          │   │   ├── _error.tsx
          │   │   └── api
          │   │       └── health.ts
          │   ├── project.json
          │   ├── tsconfig.spec.json
          │   ├── jest.config.ts
          │   ├── .eslintrc.json
          │   ├── .swcrc
          │   ├── .env
          │   ├── .gitignore
          │   ├── README.md
          │   ├── components
          │   │   └── index.tsx
          │   ├── config
          │   │   ├── redirects.json
          │   │   └── rewrites.json
          │   ├── context
          │   │   └── appContext.ts
          │   ├── ioc
          │   │   ├── baseIoc.ts
          │   │   └── getHomePageIoc.ts
          │   ├── loadRewrites.js
          │   ├── types
          │   │   └── types.ts
          │   ├── withNodeModulesCSS.js
          │   ├── .storybook
          │   │   ├── main.js
          │   │   ├── manager.js
          │   │   └── preview.js
          │   └── tsconfig.storybook.json
          └── my-app-e2e
              ├── project.json
              ├── src
              │   ├── e2e
              │   │   ├── Home
              │   │   │   └── display.ts
              │   │   └── Home.feature
              │   ├── support
              │   │   ├── e2e.ts
              │   │   └── commands.ts
              │   ├── fixtures
              │   │   └── example.json
              │   └── plugins
              │       └── index.js
              ├── cypress.config.ts
              ├── tsconfig.json
              └── .eslintrc.json
      libs
      └── .gitignore
      .prettierignore
      .eslintrc.json
      .eslintignore
      jest.preset.js
      jest.config.ts
      "
    `);
  });

  it('should update workspace targets', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const appConfig = readProjectConfiguration(appTree, `${projectName}`);
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
    ).toMatchInlineSnapshot(`
      Object {
        "target": "copy-translations-to-app",
      }
    `);

    expect(
      appConfig?.targets?.['serve']?.dependsOn?.find(
        (item: any) => item.target === 'copy-assets-to-app'
      )
    ).toMatchInlineSnapshot(`
      Object {
        "target": "copy-assets-to-app",
      }
    `);

    expect(
      appConfig?.targets?.['serve']?.dependsOn?.find(
        (item: any) => item.target === 'copy-translations-to-app'
      )
    ).toMatchInlineSnapshot(`
      Object {
        "target": "copy-translations-to-app",
      }
    `);

    expect(
      appConfig?.targets?.['serve-base']?.dependsOn?.find(
        (item: any) => item.target === 'copy-assets-to-app'
      )
    ).toMatchInlineSnapshot(`
      Object {
        "target": "copy-assets-to-app",
      }
    `);

    expect(
      appConfig?.targets?.['build']?.dependsOn?.find(
        (item: any) => item.target === 'copy-translations-to-app'
      )
    ).toMatchInlineSnapshot(`
      Object {
        "target": "copy-translations-to-app",
      }
    `);

    expect(
      appConfig?.targets?.['build']?.dependsOn?.find(
        (item: any) => item.target === 'copy-assets-to-app'
      )
    ).toMatchInlineSnapshot(`
      Object {
        "target": "copy-assets-to-app",
      }
    `);

    const e2eConfig = readProjectConfiguration(appTree, `${projectName}-e2e`);
    expect(e2eConfig?.targets?.['e2e']).toMatchInlineSnapshot(`
      Object {
        "configurations": Object {
          "production": Object {
            "devServerTarget": "my-app:serve-base:production",
          },
        },
        "executor": "@nx/cypress:cypress",
        "options": Object {
          "cypressConfig": "apps/example/my-app-e2e/cypress.config.ts",
          "devServerTarget": "my-app:serve-base",
          "testingType": "e2e",
        },
      }
    `);
  });

  it('should update cypress configs', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const cypressConfig = appTree
      .read(`${directory}-e2e/cypress.config.ts`)
      ?.toString();

    const baseUrl = 'https://localhost:3000';

    expect(cypressConfig).toContain(baseUrl);
    expect(cypressConfig).toContain('retries: 2');

    const tsconfig = readJson(appTree, `${directory}-e2e/tsconfig.json`);

    expect(tsconfig.compilerOptions.allowJs).toBe(true);
    expect(tsconfig.compilerOptions.isolatedModules).toBe(false);
    expect(
      tsconfig.compilerOptions.types.includes('@testing-library/cypress')
    ).toBe(true);
  });

  it('should exclude files', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: false,
    });

    expect(
      appTree.exists(`${directory}/config/rewrites.json`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/support/app.po.ts`)
    ).not.toBeTruthy();
    expect(
      appTree.exists(`${directory}-e2e/src/e2e/app.spec.ts`)
    ).not.toBeTruthy();
    expect(
      appTree.exists(`${directory}-e2e/specs/index.spec.tsx`)
    ).not.toBeTruthy();
  });

  it('should render without e2e files', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: false,
      e2e: false,
    });

    expect(
      appTree.exists(`${directory}-e2e/config/rewrites.json`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/support/app.po.ts`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/e2e/app.spec.ts`)
    ).not.toBeTruthy();
    expect(
      appTree.exists(`${directory}-e2e/specs/index.spec.tsx`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/cypress.config.ts`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/fixtures/example.json`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/support/commands.ts`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/support/e2e.ts`)
    ).not.toBeTruthy();

    expect(appTree.exists(`${directory}-e2e/tsconfig.json`)).not.toBeTruthy();

    expect(appTree.exists(`${directory}-e2e/.eslintrc.json`)).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/e2e/Home/display.ts`)
    ).not.toBeTruthy();

    expect(
      appTree.exists(`${directory}-e2e/src/e2e/Home.feature`)
    ).not.toBeTruthy();
  });

  it('.eslintrc should contain rootDir setting', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const appDir = directory;
    const eslintJSON = readJson(appTree, `${appDir}/.eslintrc.json`);
    expect(eslintJSON.settings.next.rootDir).toBe(appDir);
  });

  it('.eslintrc for e2e should contain updated overrides', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const e2eDir = `${directory}-e2e`;
    const eslintJSON = readJson(appTree, `${e2eDir}/.eslintrc.json`);
    expect(eslintJSON.overrides).toEqual(
      expect.arrayContaining([
        {
          files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
          rules: {
            'babel/new-cap': 'off',
            'import/no-extraneous-dependencies': 'off',
          },
        },
      ])
    );
  });

  it('should generate files with both service clients', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const baseIocContent = appTree
      .read(`${directory}/ioc/baseIoc.ts`)
      ?.toString();

    expect(baseIocContent).toContain('apolloContainer');
    expect(baseIocContent).toContain('reactQueryContainer');

    const containerContent = appTree
      .read(`${directory}/ioc/getHomePageIoc.ts`)
      ?.toString();

    expect(containerContent).toContain('apolloClient.getClient()');
    expect(containerContent).toContain('queryClient.getClient()');

    const typesContent = appTree
      .read(`${directory}/types/types.ts`)
      ?.toString();

    expect(typesContent).toContain(
      'dehydratedApolloClient?: NormalizedCacheObject'
    );
    expect(typesContent).toContain('dehydratedQueryClient?: DehydratedState');
  });

  it('should generate files without service clients', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: false,
      name: projectName,
      reactQuery: false,
      rewrites: true,
    });

    const baseIocContent = appTree
      .read(`${directory}/ioc/baseIoc.ts`)
      ?.toString();

    expect(baseIocContent).not.toContain('apolloContainer');
    expect(baseIocContent).not.toContain('reactQueryContainer');

    const containerContent = appTree
      .read(`${directory}/ioc/getHomePageIoc.ts`)
      ?.toString();

    expect(containerContent).not.toContain('apolloClient.getClient()');
    expect(containerContent).not.toContain('queryClient.getClient()');

    const typesContent = appTree
      .read(`${directory}/types/types.ts`)
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
      directory,
      apollo: true,
      name: projectName,
      reactQuery: false,
      rewrites: true,
    });

    const baseIocContent = appTree
      .read(`${directory}/ioc/baseIoc.ts`)
      ?.toString();

    expect(baseIocContent).toContain('apolloContainer');
    expect(baseIocContent).not.toContain('reactQueryContainer');

    const containerContent = appTree
      .read(`${directory}/ioc/getHomePageIoc.ts`)
      ?.toString();

    expect(containerContent).toContain('apolloClient.getClient()');
    expect(containerContent).not.toContain('queryClient.getClient()');

    const typesContent = appTree
      .read(`${directory}/types/types.ts`)
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
      directory,
      apollo: false,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const baseIocContent = appTree
      .read(`${directory}/ioc/baseIoc.ts`)
      ?.toString();

    expect(baseIocContent).not.toContain('apolloContainer');
    expect(baseIocContent).toContain('reactQueryContainer');

    const containerContent = appTree
      .read(`${directory}/ioc/getHomePageIoc.ts`)
      ?.toString();

    expect(containerContent).not.toContain('apolloClient.getClient()');
    expect(containerContent).toContain('queryClient.getClient()');

    const typesContent = appTree
      .read(`${directory}/types/types.ts`)
      ?.toString();

    expect(typesContent).not.toContain(
      'dehydratedApolloClient?: NormalizedCacheObject'
    );
    expect(typesContent).toContain('dehydratedQueryClient?: DehydratedState');
  });

  it('should create tags in workspace', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: true,
      name: projectName,
      reactQuery: true,
      rewrites: true,
      tags: 'test:tag,second:tag',
    });

    const appConfig = readProjectConfiguration(appTree, `${projectName}`);
    expect(appConfig.tags).toEqual(['type:app', 'test:tag', 'second:tag']);
  });

  it('app should use LinkRewriteContextProvider if rewrites is true', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: false,
      name: projectName,
      reactQuery: true,
      rewrites: true,
    });

    const appPageContent = appTree
      .read(`${directory}/pages/_app.tsx`)
      ?.toString();

    expect(appPageContent).toContain('LinkRewriteContextProvider');
  });

  it('app should not use LinkRewriteContextProvider if rewrites is false', async () => {
    await appGenerator(appTree, {
      directory,
      apollo: false,
      name: projectName,
      reactQuery: true,
      rewrites: false,
    });

    const appPageContent = appTree
      .read(`${directory}/pages/_app.tsx`)
      ?.toString();
    expect(appPageContent).not.toContain('LinkRewriteContextProvider');
  });
});

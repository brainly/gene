import type { Tree } from '@nx/devkit';
import { logger, readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import appGenerator from './index';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';

jest.setTimeout(10000);

describe('BFF App generator', () => {
  let appTree: Tree;
  let projectName: string;
  let directory: string;

  beforeEach(async () => {
    projectName = 'my-app';
    directory = 'apps/example.com/my-app';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
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
      └── example.com
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
          │   ├── specs
          │   │   └── pages
          │   │       └── api
          │   │           └── v1
          │   │               └── endpoint.spec.ts
          │   ├── tsconfig.json
          │   ├── project.json
          │   ├── tsconfig.spec.json
          │   ├── jest.config.ts
          │   ├── .eslintrc.json
          │   ├── .swcrc
          │   ├── .env
          │   ├── .gitignore
          │   ├── README.md
          │   ├── config
          │   │   ├── envVars.ts
          │   │   ├── openApi.ts
          │   │   ├── redirects.json
          │   │   └── rewrites.json
          │   ├── ioc
          │   │   ├── baseIoc.ts
          │   │   └── getHomePageIoc.ts
          │   ├── loadRewrites.js
          │   ├── pages
          │   │   ├── api
          │   │   │   ├── docs
          │   │   │   │   └── openapi.ts
          │   │   │   ├── health.ts
          │   │   │   └── v1
          │   │   │       └── endpoint.ts
          │   │   └── api-docs.tsx
          │   ├── types
          │   │   ├── endpointHandlerGetTypes.ts
          │   │   ├── endpointHandlerPostTypes.ts
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
              │   │   ├── app.cy.ts
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
        (item) =>
          typeof item !== 'string' && item.target === 'copy-translations-to-app'
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
          "cypressConfig": "apps/example.com/my-app-e2e/cypress.config.ts",
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

    const appDir = `${directory}`;
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
});

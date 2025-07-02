import type { Tree } from '@nx/devkit';
import { logger, readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import moduleGenerator from './index';
import { nxFileTreeSnapshotSerializer } from './utils/nxFileTreeSnapshotSerializer';

describe('Core module generator', () => {
  let appTree: Tree;
  let projectName: string;
  let directory: string;
  let createdProjectName: string;
  let domainTag: string;

  beforeEach(async () => {
    jest.spyOn(logger, 'warn').mockImplementation(() => jest.fn());
    jest.spyOn(logger, 'debug').mockImplementation(() => jest.fn());

    projectName = 'my-lib';
    directory = 'libs/my-lib';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    createdProjectName = 'my-lib-module';
    domainTag = 'domain:test';

    await new Promise(process.nextTick);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate files', async () => {
    await moduleGenerator(appTree, {
      directory,
      name: projectName,
      tags: domainTag,
    });

    expect(nxFileTreeSnapshotSerializer(appTree)).toMatchInlineSnapshot(`
      ".prettierrc
      package.json
      nx.json
      tsconfig.base.json
      apps
      ├── .gitignore
      └── my-lib-module-e2e
          ├── project.json
          ├── src
          │   ├── e2e
          │   │   ├── my-lib-module
          │   │   │   └── display.ts
          │   │   └── my-lib-module.feature
          │   ├── support
          │   │   ├── e2e.ts
          │   │   └── commands.ts
          │   ├── fixtures
          │   │   └── example.json
          │   └── plugins
          │       └── index.js
          ├── cypress.config.ts
          ├── tsconfig.json
          ├── .eslintrc.json
          └── README.md
      libs
      ├── .gitignore
      └── my-lib
          └── modules
              └── my-lib-module
                  ├── project.json
                  ├── README.md
                  ├── src
                  │   ├── index.ts
                  │   ├── README.md
                  │   └── lib
                  │       ├── MyLibModule.stories.tsx
                  │       ├── MyLibModule.tsx
                  │       ├── gene.config.yaml
                  │       ├── hooks
                  │       │   └── index.ts
                  │       └── index.ts
                  ├── tsconfig.lib.json
                  ├── .babelrc
                  ├── tsconfig.json
                  ├── .eslintrc.json
                  ├── tsconfig.spec.json
                  ├── jest.config.ts
                  ├── .storybook
                  │   ├── main.js
                  │   ├── manager.js
                  │   └── preview.js
                  └── tsconfig.storybook.json
      .prettierignore
      .eslintrc.json
      .eslintignore
      jest.preset.js
      jest.config.ts
      "
    `);
  });

  it('should update cypress and ts config', async () => {
    await moduleGenerator(appTree, {
      directory,
      name: projectName,
      tags: domainTag,
    });

    const cypressConfig = appTree
      .read('apps/my-lib-module-e2e/cypress.config.ts')
      ?.toString();

    expect(cypressConfig).toContain(`specPattern: './src/e2e/**/*.feature'`);
    expect(cypressConfig).toContain('retries: 2');

    const tsconfig = readJson(appTree, 'apps/my-lib-module-e2e/tsconfig.json');

    expect(tsconfig.compilerOptions.allowJs).toBe(true);
    expect(tsconfig.compilerOptions.isolatedModules).toBe(false);
    expect(
      tsconfig.compilerOptions.types.includes('@testing-library/cypress')
    ).toBe(true);
  });

  it('.eslintrc for e2e should contain updated overrides', async () => {
    await moduleGenerator(appTree, {
      directory,
      name: projectName,
      tags: domainTag,
    });

    const e2eDir = `apps/my-lib-module-e2e`;
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

  it('module should not export module file', async () => {
    await moduleGenerator(appTree, {
      directory,
      name: projectName,
      tags: domainTag,
    });

    const moduleContent = appTree
      .read('libs/my-lib/modules/my-lib-module/src/lib/index.ts')
      ?.toString();
    expect(moduleContent).not.toMatch(
      /export {MyLibModule} from ".\/MyLibModule";/
    );
    expect(moduleContent).toMatch(/export {};/);
    expect(moduleContent).toMatch(
      /\/\/ reexport here hooks and types used by hooks from core module/
    );
  });

  it('should create tags in workspace', async () => {
    await moduleGenerator(appTree, {
      directory,
      name: projectName,
      tags: 'test:tag,second:tag,domain:test',
    });

    const appConfig = readProjectConfiguration(appTree, createdProjectName);
    expect(appConfig.tags).toEqual([
      'type:core-module',
      'test:tag',
      'second:tag',
      'domain:test',
    ]);
  });

  it('should work with camelized module name', async () => {
    await moduleGenerator(appTree, {
      directory,
      name: 'camelizedName',
      tags: domainTag,
    });
  });
});

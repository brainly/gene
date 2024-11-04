import { logger, readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import moduleGenerator from './index';
import { applicationGenerator } from '@nrwl/next';
import { Linter } from '@nrwl/linter';

describe('Module generator', () => {
  let expectedModuleFolder: string;
  let appTree: Tree;
  let projectName: string;
  let createdProjectName: string;
  let domainTag: string;

  beforeEach(async () => {
    projectName = 'my-lib';
    expectedModuleFolder = 'libs/my-app/app-modules';
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});
    createdProjectName = 'my-app-app-modules';
    domainTag = 'domain:test';

    await applicationGenerator(appTree, {
      name: 'my-app',
      tags: ['type:app', domainTag].join(','),
      style: 'none',
      unitTestRunner: 'jest',
      linter: Linter.EsLint,
      js: false,
      e2eTestRunner: 'none',
    });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate appropriate module library files if no library has been generated before, without e2e', async () => {
    await moduleGenerator(appTree, {
      name: projectName,
      appName: 'my-app',
      shouldAutoprefix: true,
    });

    expect(
      appTree.exists(expectedModuleFolder + '/src/README.md')
    ).toBeTruthy();
    expect(
      appTree.exists(
        expectedModuleFolder + '/src/lib/my-lib-module/MyAppMyLibModule.tsx'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(expectedModuleFolder + '/src/lib/my-lib-module/index.ts')
    ).toBeTruthy();
    expect(
      appTree.exists(
        expectedModuleFolder +
          '/src/lib/my-lib-module/MyAppMyLibModule.stories.tsx'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        expectedModuleFolder + '/src/lib/my-lib-module/hooks/index.ts'
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-lib-module/display.ts'
      )
    ).toBeFalsy();
    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-lib-module.feature'
      )
    ).toBeFalsy();

    const moduleContent = appTree
      .read('libs/my-app/app-modules/src/lib/my-lib-module/index.ts')
      ?.toString();
    expect(moduleContent).toMatch(
      /export {MyAppMyLibModule} from ".\/MyAppMyLibModule"/
    );

    const appConfig = readProjectConfiguration(appTree, createdProjectName);
    expect(appConfig.tags).toEqual([
      'domain:test',
      'type:module',
      'type:application-module-library',
    ]);
  });

  it('should handle opting out of autoprefixing', async () => {
    await moduleGenerator(appTree, {
      name: projectName,
      appName: 'my-app',
      shouldAutoprefix: false,
    });

    const moduleContent = appTree
      .read('libs/my-app/app-modules/src/lib/my-lib-module/index.ts')
      ?.toString();
    expect(moduleContent).not.toMatch(/autoprefix/);
  });

  it('should generate cypress files if e2e is set to true', async () => {
    await moduleGenerator(appTree, {
      name: projectName,
      appName: 'my-app',
      shouldAutoprefix: true,
      e2e: true,
    });

    const cypressConfig = appTree
      .read('apps/my-app-app-modules-e2e/cypress.config.ts')
      ?.toString();

    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-lib-module/display.ts'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-lib-module.feature'
      )
    ).toBeTruthy();

    expect(cypressConfig).toContain('retries: 2');

    const tsconfig = readJson(
      appTree,
      'apps/my-app-app-modules-e2e/tsconfig.json'
    );

    expect(tsconfig.compilerOptions.allowJs).toBe(true);
    expect(tsconfig.compilerOptions.isolatedModules).toBe(false);
    expect(
      tsconfig.compilerOptions.types.includes('@testing-library/cypress')
    ).toBe(true);

    const e2eDir = `apps/my-app-app-modules-e2e`;
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

  it('should add module to existing library if library already exists, no e2e', async () => {
    await moduleGenerator(appTree, {
      name: projectName,
      appName: 'my-app',
      shouldAutoprefix: true,
    });

    await moduleGenerator(appTree, {
      name: 'my-second-lib',
      appName: 'my-app',
      shouldAutoprefix: true,
    });

    expect(
      appTree.exists(
        expectedModuleFolder +
          '/src/lib/my-second-lib-module/MyAppMySecondLibModule.tsx'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        expectedModuleFolder + '/src/lib/my-second-lib-module/index.ts'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        expectedModuleFolder +
          '/src/lib/my-second-lib-module/MyAppMySecondLibModule.stories.tsx'
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-second-lib-module/display.ts'
      )
    ).toBeFalsy();
    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-second-lib-module.feature'
      )
    ).toBeFalsy();

    const moduleContent = appTree
      .read(expectedModuleFolder + '/src/lib/my-second-lib-module/index.ts')
      ?.toString();
    expect(moduleContent).toMatch(
      /export {MyAppMySecondLibModule} from ".\/MyAppMySecondLibModule"/
    );
  });

  it('should add module to existing library if library already exists, with e2e', async () => {
    await moduleGenerator(appTree, {
      name: projectName,
      appName: 'my-app',
      shouldAutoprefix: true,
      e2e: true,
    });

    await moduleGenerator(appTree, {
      name: 'my-second-lib',
      appName: 'my-app',
      shouldAutoprefix: true,
      e2e: true,
    });

    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-second-lib-module/display.ts'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-second-lib-module.feature'
      )
    ).toBeTruthy();
  });

  it('should generate cypress files if initial module had e2e disabled and second one had this option enabled', async () => {
    await moduleGenerator(appTree, {
      name: projectName,
      appName: 'my-app',
      shouldAutoprefix: true,
      e2e: false,
    });

    await moduleGenerator(appTree, {
      name: 'my-second-lib',
      appName: 'my-app',
      shouldAutoprefix: true,
      e2e: true,
    });

    const cypressConfig = appTree
      .read('apps/my-app-app-modules-e2e/cypress.config.ts')
      ?.toString();

    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-second-lib-module/display.ts'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(
        'apps/my-app-app-modules-e2e/src/e2e/my-second-lib-module.feature'
      )
    ).toBeTruthy();

    expect(cypressConfig).toContain('retries: 2');

    const tsconfig = readJson(
      appTree,
      'apps/my-app-app-modules-e2e/tsconfig.json'
    );

    expect(tsconfig.compilerOptions.allowJs).toBe(true);
    expect(tsconfig.compilerOptions.isolatedModules).toBe(false);
    expect(
      tsconfig.compilerOptions.types.includes('@testing-library/cypress')
    ).toBe(true);

    const e2eDir = `apps/my-app-app-modules-e2e`;
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

  it('should work with camelized module name', async () => {
    await moduleGenerator(appTree, {
      name: 'camelizedModuleName',
      appName: 'my-app',
      shouldAutoprefix: true,
    });
  });
});

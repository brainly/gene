import { logger, readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import moduleGenerator from './index';

describe('Core module generator', () => {
  let expectedModuleFolder: string;
  let appTree: Tree;
  let projectName: string;
  let createdProjectName: string;
  let domainTag: string;

  beforeEach(async () => {
    projectName = 'my-lib';
    expectedModuleFolder = 'libs/my-lib/modules';
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});
    createdProjectName = 'my-lib-modules-my-lib-module';
    domainTag = 'domain:test';

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate files', async () => {
    await moduleGenerator(appTree, {
      directory: '',
      name: projectName,
      tags: domainTag,
    });

    expect(
      appTree.exists(expectedModuleFolder + '/my-lib-module/README.md')
    ).toBeTruthy();
    expect(
      appTree.exists(
        expectedModuleFolder + '/my-lib-module/src/lib/MyLibModule.tsx'
      )
    ).toBeTruthy();
    expect(
      appTree.exists(expectedModuleFolder + '/my-lib-module/src/lib/index.ts')
    ).toBeTruthy();
    expect(
      appTree.exists(
        expectedModuleFolder + '/my-lib-module/src/lib/MyLibModule.stories.tsx'
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        expectedModuleFolder + '/my-lib-module/src/lib/hooks/index.ts'
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        'apps/my-lib-modules-my-lib-module-e2e/src/e2e/app.spec.ts'
      )
    );
    expect(
      appTree.exists(
        'apps/my-lib-modules-my-lib-module-e2e/src/e2e/my-lib-module.feature'
      )
    );
    expect(
      appTree.exists(
        'apps/my-lib-modules-my-lib-module-e2e/src/e2e/my-lib-module/display.ts'
      )
    );
  });

  it('should update cypress and ts config', async () => {
    await moduleGenerator(appTree, {
      directory: '',
      name: projectName,
      tags: domainTag,
    });

    const cypressConfig = appTree
      .read('apps/my-lib-modules-my-lib-module-e2e/cypress.config.ts')
      ?.toString();

    expect(cypressConfig).toContain(`specPattern: './src/e2e/**/*.feature'`);
    expect(cypressConfig).toContain('retries: 2');

    const tsconfig = readJson(
      appTree,
      'apps/my-lib-modules-my-lib-module-e2e/tsconfig.json'
    );

    expect(tsconfig.compilerOptions.allowJs).toBe(true);
    expect(tsconfig.compilerOptions.isolatedModules).toBe(false);
    expect(
      tsconfig.compilerOptions.types.includes('@testing-library/cypress')
    ).toBe(true);
  });

  it('.eslintrc for e2e should contain updated overrides', async () => {
    await moduleGenerator(appTree, {
      directory: '',
      name: projectName,
      tags: domainTag,
    });

    const e2eDir = `apps/my-lib-modules-my-lib-module-e2e`;
    const eslintJSON = readJson(appTree, `${e2eDir}/.eslintrc.json`);
    expect(eslintJSON.overrides).toEqual(
      expect.arrayContaining([
        {
          files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
          rules: {
            'babel/new-cap': 'off',
          },
        }
      ])
    );
  });

  it('module should not export module file', async () => {
    await moduleGenerator(appTree, {
      directory: '',
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
      directory: '',
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
      directory: '',
      name: 'camelizedName',
      tags: domainTag,
    });
  });
});

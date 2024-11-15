import { logger, readJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import libraryGenerator from './index';

describe('Library generator', () => {
  let appTree: Tree;
  let projectName: string;

  beforeEach(async () => {
    projectName = 'my-library';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate files', async () => {
    await libraryGenerator(appTree, {
      directory: '/',
      name: projectName,
      tags: '',
    });

    expect(appTree.exists('libs/my-library/src/index.ts')).toBeTruthy();
  });

  it('.eslintrc should contain additional overrides rule', async () => {
    await libraryGenerator(appTree, {
      directory: '/',
      name: projectName,
      tags: '',
    });

    const eslintLibPath = `libs/my-library/.eslintrc.json`;
    const eslintJSON = readJson(appTree, eslintLibPath);
    expect(
      eslintJSON.overrides.find((rule: any) =>
        rule.extends?.includes('plugin:react-hooks/recommended')
      )
    );
  });

  it('should be able to generate lib directly in libs folder', async () => {
    await libraryGenerator(appTree, {
      directory: undefined,
      name: projectName,
      tags: '',
    });

    expect(appTree.exists('libs/my-library/src/index.ts')).toBeTruthy();
  });

  it('should include setupFilesAfterEnv in jest.config file', async () => {
    await libraryGenerator(appTree, {
      directory: 'test/subdir/anothersubdir',
      name: projectName,
      tags: '',
    });

    const jestConfigContent = appTree
      .read('libs/test/subdir/anothersubdir/my-library/jest.config.ts')
      ?.toString();
    expect(jestConfigContent).toContain('setupFilesAfterEnv');
    expect(jestConfigContent).toContain('../../../../../jest.setup.js');
  });

  it('should have proper transform in jest.config file', async () => {
    await libraryGenerator(appTree, {
      directory: undefined,
      name: projectName,
      tags: '',
    });

    const jestConfigContent = appTree
      .read('libs/my-library/jest.config.ts')
      ?.toString();
    expect(jestConfigContent).toContain(
      `transform: { '^.+\\\\.[tj]sx?$': 'ts-jest' }`
    );
  });

  it('jest.config should include isolateModules: true', async () => {
    await libraryGenerator(appTree, {
      directory: undefined,
      name: projectName,
      tags: '',
    });

    const jestConfigContent = appTree
      .read('libs/my-library/jest.config.ts')
      ?.toString();
    expect(jestConfigContent).toContain('isolatedModules: true');
  });

  it('jest.config should exclude diagnostics for all test files', async () => {
    await libraryGenerator(appTree, {
      directory: undefined,
      name: projectName,
      tags: '',
    });

    const jestConfigContent = appTree
      .read('libs/my-library/jest.config.ts')
      ?.toString();
    expect(jestConfigContent).toContain(`exclude: ['**']`);
  });
});

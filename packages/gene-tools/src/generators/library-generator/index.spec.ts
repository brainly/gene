import type { Tree } from '@nx/devkit';
import { logger, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import libraryGenerator from './index';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';

describe('Library generator', () => {
  let appTree: Tree;
  let projectName: string;
  let directory: string;

  beforeEach(async () => {
    jest.spyOn(logger, 'warn').mockImplementation(() => jest.fn());
    jest.spyOn(logger, 'debug').mockImplementation(() => jest.fn());

    projectName = 'my-library';
    directory = 'libs/my-library';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate files', async () => {
    await libraryGenerator(appTree, {
      directory,
      name: projectName,
      tags: '',
    });

    expect(nxFileTreeSnapshotSerializer(appTree)).toMatchInlineSnapshot(`
      ".prettierrc
      package.json
      nx.json
      tsconfig.base.json
      apps
      └── .gitignore
      libs
      ├── .gitignore
      └── my-library
          ├── project.json
          ├── README.md
          ├── src
          │   └── index.ts
          ├── tsconfig.lib.json
          ├── .babelrc
          ├── tsconfig.json
          ├── .eslintrc.json
          ├── tsconfig.spec.json
          └── jest.config.ts
      .prettierignore
      .eslintrc.json
      .eslintignore
      jest.preset.js
      jest.config.ts
      "
    `);
  });

  it('.eslintrc should contain additional overrides rule', async () => {
    await libraryGenerator(appTree, {
      directory,
      name: projectName,
      tags: '',
    });

    const eslintLibPath = `${directory}/.eslintrc.json`;
    const eslintJSON = readJson(appTree, eslintLibPath);
    expect(
      eslintJSON.overrides.find((rule: any) =>
        rule.extends?.includes('plugin:react-hooks/recommended')
      )
    );
  });

  it('should include setupFilesAfterEnv in jest.config file', async () => {
    await libraryGenerator(appTree, {
      directory: 'libs/test/subdir/anothersubdir/my-library',
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
      directory,
      name: projectName,
      tags: '',
    });

    const jestConfigContent = appTree
      .read(`${directory}/jest.config.ts`)
      ?.toString();
    expect(jestConfigContent).toContain(
      `transform: { '^.+\\\\.[tj]sx?$': 'ts-jest' }`
    );
  });

  it('jest.config should include isolateModules: true', async () => {
    await libraryGenerator(appTree, {
      directory,
      name: projectName,
      tags: '',
    });

    const jestConfigContent = appTree
      .read(`${directory}/jest.config.ts`)
      ?.toString();
    expect(jestConfigContent).toContain('isolatedModules: true');
  });

  it('jest.config should exclude diagnostics for all test files', async () => {
    await libraryGenerator(appTree, {
      directory,
      name: projectName,
      tags: '',
    });

    const jestConfigContent = appTree
      .read(`${directory}/jest.config.ts`)
      ?.toString();
    expect(jestConfigContent).toContain(`exclude: ['**']`);
  });
});

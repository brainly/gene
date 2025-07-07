import type { Tree } from '@nx/devkit';
import { logger, readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import componentsLibraryGenerator from './index';
import { prompt } from 'inquirer';
import componentGenerator from '../component-generator';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';

/**
 * @description
 * This timeout is needed because of the component generator that is used in one test and typescript build.
 */
jest.setTimeout(50000);

jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

describe('Components library generator', () => {
  let appTree: Tree;
  let projectName: string;
  let projectNameWithSuffix: string;
  let directory: string;

  beforeEach(async () => {
    jest.spyOn(logger, 'warn').mockImplementation(() => jest.fn());
    jest.spyOn(logger, 'debug').mockImplementation(() => jest.fn());

    projectName = 'answer-box';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    directory = 'libs/social-qa/question/components';
    projectNameWithSuffix = `${projectName}-ui`;

    (prompt as unknown as jest.Mock).mockImplementation(({ name }) => {
      if (name === 'input') {
        return { input: 'TestComponent' };
      }
    });

    await new Promise(process.nextTick);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate files', async () => {
    await componentsLibraryGenerator(appTree, {
      directory,
      name: projectName,
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
      └── social-qa
          └── question
              └── components
                  ├── project.json
                  ├── README.md
                  ├── src
                  │   └── index.ts
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

  it('should update tsconfig with isolatedModules', async () => {
    await componentsLibraryGenerator(appTree, {
      directory,
      name: projectName,
    });

    const tsconfig = readJson(appTree, `${directory}/tsconfig.json`);

    expect(tsconfig.compilerOptions.isolatedModules).toBe(true);
  });

  it('should create tags in workspace', async () => {
    await componentsLibraryGenerator(appTree, {
      directory,
      name: projectName,
      tags: 'test:tag,second:tag',
    });

    const appConfig = readProjectConfiguration(appTree, projectNameWithSuffix);
    expect(appConfig.tags).toEqual([
      'type:component',
      'test:tag',
      'second:tag',
    ]);
  });

  it('should generate and reexport component in library', async () => {
    await componentsLibraryGenerator(appTree, {
      directory,
      name: projectName,
    });

    await componentGenerator(appTree, {
      library: projectNameWithSuffix,
      promptsProfile: 'basic',
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
      └── social-qa
          └── question
              └── components
                  ├── project.json
                  ├── README.md
                  ├── src
                  │   ├── index.ts
                  │   └── lib
                  │       └── TestComponent
                  │           ├── TestComponent.module.scss
                  │           ├── TestComponent.spec.tsx
                  │           ├── TestComponent.stories.tsx
                  │           ├── TestComponent.tsx
                  │           ├── TestComponentCopyType.ts
                  │           ├── TestComponentEventsType.ts
                  │           └── index.ts
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

    const indexContent = appTree.read(`${directory}/src/index.ts`)?.toString();
    expect(indexContent).toContain("export * from './lib/TestComponent';");
  });
});

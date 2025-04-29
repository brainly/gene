import type { Tree } from '@nx/devkit';
import { logger, readJson, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import componentsLibraryGenerator from './index';
import { prompt } from 'inquirer';
import componentGenerator from '../component-generator';

/**
 * @description
 * This timeout is needed because of the component generator that is used in one test and typescript build.
 */
jest.setTimeout(50000);

jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

describe('Components library generator', () => {
  let appTree: Tree;
  let projectName: string;

  beforeEach(async () => {
    projectName = 'answer-box';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);

    (prompt as unknown as jest.Mock).mockImplementation(({ name }) => {
      if (name === 'input') {
        return { input: 'TestComponent' };
      }
    });
  });

  it('should generate files', async () => {
    await componentsLibraryGenerator(appTree, {
      directory: 'social-qa/question/components',
      name: projectName,
    });

    expect(
      appTree.exists(
        `libs/social-qa/question/components/${projectName}-ui/src/index.ts`
      )
    ).toBeTruthy();
  });

  it('should update tsconfig with isolatedModules', async () => {
    await componentsLibraryGenerator(appTree, {
      directory: 'social-qa/question/components',
      name: projectName,
    });

    const tsconfig = readJson(
      appTree,
      `libs/social-qa/question/components/${projectName}-ui/tsconfig.json`
    );

    expect(tsconfig.compilerOptions.isolatedModules).toBe(true);
  });

  it('should create tags in workspace', async () => {
    await componentsLibraryGenerator(appTree, {
      directory: 'social-qa/question/components',
      name: projectName,
      tags: 'test:tag,second:tag',
    });

    const appConfig = readProjectConfiguration(
      appTree,
      `social-qa-question-components-${projectName}-ui`
    );
    expect(appConfig.tags).toEqual([
      'type:component',
      'test:tag',
      'second:tag',
    ]);
  });

  it('should generate and reexport component in library', async () => {
    await componentsLibraryGenerator(appTree, {
      directory: 'social-qa/question/components',
      name: projectName,
    });

    const libName = `social-qa-question-components-${projectName}-ui`;

    await componentGenerator(appTree, {
      library: libName,
      promptsProfile: 'basic',
    });

    const indexContent = appTree
      .read(`libs/social-qa/question/components/${projectName}-ui/src/index.ts`)
      ?.toString();
    expect(indexContent).toContain("export * from './lib/TestComponent';");

    expect(
      appTree.exists(
        `libs/social-qa/question/components/${projectName}-ui/src/lib/TestComponent/index.ts`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `libs/social-qa/question/components/${projectName}-ui/src/lib/TestComponent/TestComponent.tsx`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `libs/social-qa/question/components/${projectName}-ui/src/lib/TestComponent/TestComponent.spec.tsx`
      )
    ).toBeTruthy();

    expect(
      appTree.exists(
        `libs/social-qa/question/components/${projectName}-ui/src/lib/TestComponent/TestComponent.stories.tsx`
      )
    ).toBeTruthy();
  });
});

import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import libraryGenerator from '../library-generator';
import subappGenerator from './index';
import { prompt } from 'inquirer';

jest.mock('inquirer', () => ({ prompt: jest.fn(), registerPrompt: jest.fn() }));

describe('Subapp generator', () => {
  let appTree: Tree;
  let projectName: string;

  beforeEach(async () => {
    projectName = 'my-subapp';
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);

    await libraryGenerator(appTree, {
      name: 'api-utils',
      directory: '',
      tags: '',
    });
  });

  it('should generate files', async () => {
    await subappGenerator(appTree, {
      library: 'api-utils',
      name: projectName,
      directory: 'subapps',
      getHandler: true,
      postHandler: true,
    });

    expect(
      appTree.exists('libs/api-utils/src/subapps/my-subapp.ts'),
    ).toBeTruthy();
  });

  it('should reexport subapp', async () => {
    await subappGenerator(appTree, {
      library: 'api-utils',
      name: projectName,
      directory: 'subapps',
      getHandler: true,
      postHandler: true,
    });

    const indexContent = appTree
      .read(`libs/api-utils/src/index.ts`)
      ?.toString();
    expect(indexContent).toContain("export * from './subapps/my-subapp';");
  });

  it('should create new lib if it does not exist', async () => {
    (prompt as unknown as jest.Mock).mockImplementation(([{ name }]) => {
      if (name === 'shouldGenerateLib') {
        return { shouldGenerateLib: true };
      }

      if (name === 'libDirectory') {
        return { libDirectory: 'my-domain' };
      }
    });

    await subappGenerator(appTree, {
      library: 'my-api-utils',
      name: projectName,
      directory: 'subapps',
      getHandler: true,
      postHandler: true,
    });

    expect(
      appTree.exists('libs/my-domain/my-api-utils/src/subapps/my-subapp.ts'),
    ).toBeTruthy();

    const indexContent = appTree
      .read(`libs/my-domain/my-api-utils/src/index.ts`)
      ?.toString();
    expect(indexContent).toContain("export * from './subapps/my-subapp';");
  });

  it('should generate handlers for GET and POST methods', async () => {
    await subappGenerator(appTree, {
      library: 'api-utils',
      name: projectName,
      directory: 'subapps',
      getHandler: true,
      postHandler: true,
    });

    const subappContent = appTree
      .read(`libs/api-utils/src/subapps/my-subapp.ts`)
      ?.toString();

    expect(subappContent).toContain('handleGetMySubapp');
    expect(subappContent).toContain('handlePostMySubapp');
  });
});

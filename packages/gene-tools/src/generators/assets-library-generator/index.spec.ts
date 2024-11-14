import { logger, readJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import assetsLibraryGenerator from './index';

describe('Assets library generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate files', async () => {
    await assetsLibraryGenerator(appTree, {
      withStyleGuide: true,
    });

    expect(appTree.exists('libs/assets/src/index.ts')).toBeTruthy();
  });
});

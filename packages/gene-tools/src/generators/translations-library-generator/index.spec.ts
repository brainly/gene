import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import translationsLibraryGenerator from './index';

describe('Translations library generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    jest.spyOn(logger, 'warn').mockImplementation(() => 1);
    jest.spyOn(logger, 'debug').mockImplementation(() => 1);
  });

  it('should generate files', async () => {
    await translationsLibraryGenerator(appTree);

    expect(
      appTree.exists('libs/translations/src/locales/test.json'),
    ).toBeTruthy();
  });
});

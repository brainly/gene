import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import assetsLibraryGenerator from './index';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';

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

    expect(nxFileTreeSnapshotSerializer(appTree)).toMatchInlineSnapshot(`
      ".prettierrc
      package.json
      nx.json
      tsconfig.base.json
      apps
      └── .gitignore
      libs
      ├── .gitignore
      └── assets
          ├── project.json
          ├── README.md
          ├── src
          │   ├── index.ts
          │   ├── consts.ts
          │   ├── nx-fonts
          │   │   └── .gitkeep
          │   ├── nx-images
          │   │   └── .gitkeep
          │   └── nx-static
          │       └── .gitkeep
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
});

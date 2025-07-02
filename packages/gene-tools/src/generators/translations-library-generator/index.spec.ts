import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import translationsLibraryGenerator from './index';
import { nxFileTreeSnapshotSerializer } from '../core-module-generator/utils/nxFileTreeSnapshotSerializer';

describe('Translations library generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    await new Promise(process.nextTick);
  });

  it('should generate files', async () => {
    await translationsLibraryGenerator(appTree);

    expect(nxFileTreeSnapshotSerializer(appTree)).toMatchInlineSnapshot(`
      ".prettierrc
      package.json
      nx.json
      tsconfig.base.json
      apps
      └── .gitignore
      libs
      ├── .gitignore
      └── translations
          ├── project.json
          ├── README.md
          ├── src
          │   ├── index.ts
          │   └── locales
          │       └── test.json
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

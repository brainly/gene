import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readJson,
  writeJson,
} from '@nx/devkit';
import type { AssetsLibraryGenerator } from './schema';

import libraryGenerator from '../library-generator';

export default async function (tree: Tree, schema: AssetsLibraryGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');

  await libraryGenerator(tree, {
    name: 'assets',
    directory: 'libs/assets',
    tags: 'type:utility',
  });

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    'libs/assets/src',
    {
      ...schema,
      tmpl: '',
    }
  );

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  installPackagesTask,
  joinPathFragments,
  readJson,
  writeJson,
} from '@nx/devkit';
import libraryGenerator from '../library-generator';

export default async function (tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const directory = joinPathFragments(libsDir, 'e2e-testing-providers');

  const currentPackageJson = readJson(tree, 'package.json');

  await libraryGenerator(tree, {
    name: 'e2e-testing-providers',
    directory,
    tags: 'type:utility',
  });

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    joinPathFragments(directory, 'src'),
    {
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

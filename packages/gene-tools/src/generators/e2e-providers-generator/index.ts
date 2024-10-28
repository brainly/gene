import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  Tree,
  readJson,
  writeJson,
} from '@nrwl/devkit';
import libraryGenerator from '../library-generator';

export default async function (tree: Tree) {
  const currentPackageJson = readJson(tree, 'package.json');

  await libraryGenerator(tree, {
    name: 'e2e-testing-providers',
    directory: '',
    tags: 'type:utility',
  });

  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    'libs/e2e-testing-providers/src',
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

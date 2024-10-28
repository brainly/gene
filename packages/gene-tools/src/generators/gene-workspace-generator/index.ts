import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  Tree,
  workspaceRoot,
} from '@nrwl/devkit';
import assetsLibraryGenerator from '../assets-library-generator';
import translationsLibraryGenerator from '../translations-library-generator';

export default async function (tree: Tree) {
  await assetsLibraryGenerator(tree, {
    withStyleGuide: true,
  });

  await translationsLibraryGenerator(tree);

  await generateFiles(tree, joinPathFragments(__dirname, './files'), './', {});

  // Update .eslintrc.json
  const eslintJson = tree.read('.eslintrc.json', 'utf-8');
  const updatedEslintJson = eslintJson.replace(
    'plugin:@nrwl/nx/typescript',
    'plugin:@brainly-gene/gene/basic'
  );

  tree.write('.eslintrc.json', updatedEslintJson);

  return () => {
    installPackagesTask(tree);
  };
}

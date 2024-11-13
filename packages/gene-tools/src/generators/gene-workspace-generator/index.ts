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
  const updatedEslintJson = eslintJson
    .replace(
      'plugin:@nrwl/nx/typescript',
      'plugin:@brainly-gene/eslint-plugin/basic'
    )
    .replace(
      '"plugins": ["@nrwl/nx"]',
      '"plugins": ["@nrwl/nx", "@brainly-gene"]'
    );

  tree.write('.eslintrc.json', updatedEslintJson);

  // Update .gitignore to ignore .storybook/assets
  const gitignore = tree.read('.gitignore', 'utf-8');
  const updatedGitignore = gitignore + '\n.storybook/assets';
  tree.write('.gitignore', updatedGitignore);

  // Create empty jest.setup.js file in the root
  tree.write('jest.setup.js', 'module.exports = {};');

  return () => {
    installPackagesTask(tree);
  };
}

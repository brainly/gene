import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nx/devkit';

export async function storybookInitGenerator(tree: Tree) {
  generateFiles(tree, joinPathFragments(__dirname, 'files'), '.storybook', {
    tmpl: '',
  });

  await formatFiles(tree);
}

export default storybookInitGenerator;

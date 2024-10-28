import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';

export async function storybookInitGenerator(tree: Tree) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    '.storybook',
    {
      tmpl: '',
    }
  );

  await formatFiles(tree);
}

export default storybookInitGenerator;

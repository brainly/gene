import {
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import {NormalizedOptions} from '../schema';

export function generateConfigurationFiles(
  tree: Tree,
  options: NormalizedOptions
): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.storybookDir,
    {
      isLibrary: options.isLibrary,
      offsetFromRoot: offsetFromRoot(options.storybookDir),
      tmpl: '',
    }
  );
}

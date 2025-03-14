import type {
  Tree} from '@nx/devkit';
import {
  generateFiles,
  joinPathFragments,
  offsetFromRoot
} from '@nx/devkit';
import type { NormalizedOptions } from '../schema';

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

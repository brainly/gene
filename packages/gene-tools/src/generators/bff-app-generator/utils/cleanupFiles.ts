import { Tree } from '@nx/devkit';
import { BrainlyNextJSAppGenerator } from '../schema';

export const cleanupFiles = (tree: Tree, filesToRemove: Array<string>) => {
  filesToRemove &&
    tree
      .listChanges()
      .map(({ path }) => path)
      .filter((path) => filesToRemove.some((e) => path.endsWith(e)))
      .forEach((path) => tree.delete(path));
};

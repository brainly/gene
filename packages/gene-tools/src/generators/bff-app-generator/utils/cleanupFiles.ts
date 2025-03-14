import type { Tree } from '@nx/devkit';

export const cleanupFiles = (tree: Tree, filesToRemove: string[]) => {
  filesToRemove &&
    tree
      .listChanges()
      .map(({ path }) => path)
      .filter((path) => filesToRemove.some((e) => path.endsWith(e)))
      .forEach((path) => tree.delete(path));
};

import type { Tree } from '@nx/devkit';

export const hasFilesInTheFolder = (tree: Tree, dir: string): boolean => {
  const files = tree.children(dir);
  return files.length > 0;
};

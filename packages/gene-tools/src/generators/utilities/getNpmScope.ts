import { readNxJson, Tree } from '@nx/devkit';

export const getNpmScope = (tree: Tree) => {
  const nxJson = readNxJson(tree);

  return nxJson.npmScope;
};

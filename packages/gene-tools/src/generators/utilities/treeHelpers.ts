import type { Tree } from '@nx/devkit';
import { getProjects } from '@nx/devkit';

export const getAllAppKeys = (tree: Tree) => {
  const projects = getProjects(tree);

  return [...projects.entries()]
    .filter(([key, config]) => config?.tags?.includes('type:app') && key)
    .map(([key]) => key);
};

export const getListOfAllProjectKeys = (tree: Tree) => {
  return [...getProjects(tree).keys()];
};

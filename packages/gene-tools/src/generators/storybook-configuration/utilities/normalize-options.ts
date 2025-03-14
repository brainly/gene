import type { Tree } from '@nx/devkit';
import { getProjects } from '@nx/devkit';
import type { NormalizedOptions, Options } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: Options,
): NormalizedOptions {
  const projects = getProjects(tree);
  const project = projects.get(options.name);
  if (!project) {
    throw new Error(
      `The project "${options.name}" does not exist in the workspace.`,
    );
  }

  return {
    ...options,
    isLibrary: project.projectType === 'library',
    projectRoot: project.root,
    storybookDir: `${project.root}/.storybook`,
  };
}

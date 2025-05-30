import type { ExecutorContext } from '@nx/devkit';
import { copySync, removeSync } from 'fs-extra';
import { join } from 'path';

async function executor(_: unknown, context: ExecutorContext) {
  const projectName = context.projectName;
  const appRootPath = context.root;

  if (!projectName) {
    throw new Error('No project specified.');
  }

  const translationsProject = 'translations';
  const workspace = context.projectsConfigurations;
  const project = workspace.projects[projectName];

  if (!workspace.projects[translationsProject]) {
    throw new Error(
      `Project "${translationsProject}" not found in workspace. You can generate it using "nx g @brainly-gene/tools:translations-library".`
    );
  }

  if (!project) {
    throw new Error(`Project "${project}" not found in workspace.`);
  }

  if (!workspace.projects[translationsProject].sourceRoot) {
    throw new Error(
      `Something went wrong. Project "${translationsProject}" does not have a source root.`
    );
  }

  const from = join(
    appRootPath,
    workspace.projects[translationsProject].sourceRoot,
    'locales'
  );
  const to = join(appRootPath, project.root, 'public', 'nx-locales');

  removeSync(to);
  copySync(from, to, { recursive: true });

  return { success: true };
}

export default executor;

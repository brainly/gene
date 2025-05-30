import type { ExecutorContext } from '@nx/devkit';
import { copySync, removeSync } from 'fs-extra';
import { join } from 'path';
import { toAbsolute } from '../utilities/path';

async function executor(_: unknown, context: ExecutorContext) {
  const appRootPath = context.root;
  const translationsProject = 'translations';
  const workspace = context.projectsConfigurations;

  if (!workspace.projects[translationsProject]) {
    throw new Error(
      `Project "${translationsProject}" not found in workspace. You can generate it using "nx g @brainly-gene/tools:translations-library".`
    );
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

  const to = toAbsolute('.storybook/assets/locales');

  removeSync(to);
  copySync(from, to, { recursive: true });

  return { success: true };
}

export default executor;

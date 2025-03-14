// @ts-expect-error TS7016
import { copySync, removeSync } from 'fs-extra';
import { join } from 'path';
import { toAbsolute } from '../utilities/path';

async function executor(options: any, context: { root: any; workspace: any }) {
  const appRootPath = context.root;
  const translationsProject = 'translations';
  const workspace = context.workspace;

  if (!workspace.projects[translationsProject]) {
    throw new Error(
      `Project "${translationsProject}" not found in workspace. You can generate it using "nx g @brainly-gene/tools:translations-library".`,
    );
  }

  const from = join(
    appRootPath,
    workspace.projects[translationsProject].sourceRoot,
    'locales',
  );

  const to = toAbsolute('.storybook/assets/locales');

  removeSync(to);
  copySync(from, to, { recursive: true });

  return { success: true };
}

export default executor;

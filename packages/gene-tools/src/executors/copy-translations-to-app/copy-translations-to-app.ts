// @ts-expect-error TS7016
import { copySync, removeSync } from 'fs-extra';
import { join } from 'path';

async function executor(
  options: any,
  context: { projectName: any; root: any; workspace: any },
) {
  const projectName = context.projectName;
  const appRootPath = context.root;

  if (!projectName) {
    throw new Error('No project specified.');
  }

  const translationsProject = 'translations';
  const workspace = context.workspace;
  const project = workspace.projects[projectName];

  if (!workspace.projects[translationsProject]) {
    throw new Error(
      `Project "${translationsProject}" not found in workspace. You can generate it using "nx g @brainly-gene/tools:translations-library".`,
    );
  }

  if (!project) {
    throw new Error(`Project "${project}" not found in workspace.`);
  }

  const from = join(
    appRootPath,
    workspace.projects[translationsProject].sourceRoot,
    'locales',
  );
  const to = join(appRootPath, project.root, 'public', 'nx-locales');

  removeSync(to);
  copySync(from, to, { recursive: true });

  return { success: true };
}

export default executor;

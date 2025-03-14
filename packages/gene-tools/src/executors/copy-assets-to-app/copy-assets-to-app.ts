// @ts-expect-error TS7016
import { copySync } from 'fs-extra';
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

  const assetsProject = 'assets';
  const workspace = context.workspace;
  const project = workspace.projects[projectName];

  if (!workspace.projects[assetsProject]) {
    throw new Error(
      `Project "${assetsProject}" not found in workspace. You can generate it using "nx g @brainly-gene/tools:assets-library".`,
    );
  }

  if (!project) {
    throw new Error(`Project "${project}" not found in workspace.`);
  }

  const fontFrom = join(
    appRootPath,
    workspace.projects[assetsProject].sourceRoot,
    'nx-fonts',
  );
  const fontTo = join(appRootPath, project.root, 'public', 'nx-fonts');

  const imageFrom = join(
    appRootPath,
    workspace.projects[assetsProject].sourceRoot,
    'nx-images',
  );
  const imageTo = join(appRootPath, project.root, 'public', 'nx-images');

  const staticFrom = join(
    appRootPath,
    workspace.projects[assetsProject].sourceRoot,
    'nx-static',
  );
  const staticTo = join(appRootPath, project.root, 'public', 'nx-static');

  copySync(fontFrom, fontTo, { recursive: true, overwrite: true });

  copySync(imageFrom, imageTo, {
    recursive: true,
    overwrite: true,
    filter: (src: string | string[]) => {
      if (src.includes('.svg')) {
        throw new Error(
          `'Please put SVG files into "nx-static" folder instead of "nx-images": ${src}`,
        );
      }
      return true;
    },
  });

  copySync(staticFrom, staticTo, { recursive: true, overwrite: true });

  return { success: true };
}
export default executor;

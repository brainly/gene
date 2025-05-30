import type { ExecutorContext } from '@nx/devkit';
import { copySync } from 'fs-extra';
import { join } from 'path';

async function executor(_: unknown, context: ExecutorContext) {
  const projectName = context.projectName;
  const appRootPath = context.root;

  if (!projectName) {
    throw new Error('No project specified.');
  }

  const assetsProject = 'assets';
  const workspace = context.projectsConfigurations;
  const project = workspace.projects[projectName];

  if (!workspace.projects[assetsProject]) {
    throw new Error(
      `Project "${assetsProject}" not found in workspace. You can generate it using "nx g @brainly-gene/tools:assets-library".`
    );
  }

  if (!project) {
    throw new Error(`Project "${project}" not found in workspace.`);
  }

  if (!workspace.projects[assetsProject].sourceRoot) {
    throw new Error(
      `Something went wrong. Project "${assetsProject}" does not have a source root.`
    );
  }

  const fontFrom = join(
    appRootPath,
    workspace.projects[assetsProject].sourceRoot,
    'nx-fonts'
  );
  const fontTo = join(appRootPath, project.root, 'public', 'nx-fonts');

  const imageFrom = join(
    appRootPath,
    workspace.projects[assetsProject].sourceRoot,
    'nx-images'
  );
  const imageTo = join(appRootPath, project.root, 'public', 'nx-images');

  const staticFrom = join(
    appRootPath,
    workspace.projects[assetsProject].sourceRoot,
    'nx-static'
  );
  const staticTo = join(appRootPath, project.root, 'public', 'nx-static');

  copySync(fontFrom, fontTo, { recursive: true, overwrite: true });

  copySync(imageFrom, imageTo, {
    recursive: true,
    overwrite: true,
    filter: (src: string | string[]) => {
      if (src.includes('.svg')) {
        throw new Error(
          `'Please put SVG files into "nx-static" folder instead of "nx-images": ${src}`
        );
      }
      return true;
    },
  });

  copySync(staticFrom, staticTo, { recursive: true, overwrite: true });

  return { success: true };
}
export default executor;

import type { ExecutorContext } from '@nx/devkit';
import { prepareStorybookRootAssets } from './prepare-storybook-root-assets';
import { copySync, removeSync } from 'fs-extra';
import { join } from 'path';
import { toAbsolute } from '../utilities/path';

async function executor(_: unknown, context: ExecutorContext) {
  const workspaceRoot = context.root;
  const assetsProject = 'assets';
  const workspace = context.projectsConfigurations;

  prepareStorybookRootAssets(workspaceRoot);

  if (!workspace.projects[assetsProject]) {
    throw new Error(
      `Project "${assetsProject}" not found in workspace. You can generate it using "nx g @brainly-gene/tools:assets-library".`
    );
  }

  if (!workspace.projects[assetsProject].sourceRoot) {
    throw new Error(
      `Something went wrong. Project "${assetsProject}" does not have a source root.`
    );
  }

  const imagesFrom = join(
    workspaceRoot,
    workspace.projects[assetsProject].sourceRoot,
    'nx-images'
  );

  const imagesTo = toAbsolute('.storybook/assets/nx-images');

  const staticFrom = join(
    workspaceRoot,
    workspace.projects[assetsProject].sourceRoot,
    'nx-static'
  );

  const staticTo = toAbsolute('.storybook/assets/nx-static');

  const fontFrom = join(
    workspaceRoot,
    workspace.projects[assetsProject].sourceRoot,
    'nx-fonts'
  );
  const fontTo = toAbsolute('.storybook/assets/nx-fonts');

  removeSync(imagesTo);
  removeSync(staticTo);
  removeSync(fontTo);

  copySync(imagesFrom, imagesTo, {
    recursive: true,
    overwrite: true,
    filter: (src: string | string[]) => {
      if (src.includes('.svg')) {
        throw new Error(
          `Please put SVG files into "nx-static" folder instead of "nx-images": ${src}`
        );
      }
      return true;
    },
  });

  copySync(staticFrom, staticTo, { recursive: true });
  copySync(fontFrom, fontTo, { recursive: true });

  return { success: true };
}

export default executor;

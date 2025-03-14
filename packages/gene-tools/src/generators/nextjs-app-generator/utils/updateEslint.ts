import type { Tree} from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

export const updateEslint = (tree: Tree, appDir: string) => {
  updateJson(
    tree,
    joinPathFragments(appDir, './.eslintrc.json'),
    (eslintConfig) => {
      return {
        ...eslintConfig,
        settings: {
          next: {
            rootDir: appDir,
          },
        },
      };
    }
  );
};

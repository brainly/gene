import {joinPathFragments, Tree, updateJson} from '@nrwl/devkit';

export const updateEslint = (tree: Tree, appDir: string) => {
  updateJson(
    tree,
    joinPathFragments(appDir, './.eslintrc.json'),
    eslintConfig => {
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

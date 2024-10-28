import { Tree, updateJson } from '@nrwl/devkit';

export const updateCypressTsConfig = (tree: Tree, e2ePath: string) => {
  updateJson(tree, `${e2ePath}/tsconfig.json`, (json) => {
    return {
      ...json,

      compilerOptions: {
        allowJs: true,
        isolatedModules: false,
        types: [
          ...(json?.compilerOptions?.types || []),
          '@testing-library/cypress',
        ],
      },
    };
  });
};

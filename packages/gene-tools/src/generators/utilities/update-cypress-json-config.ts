import { Tree, updateJson } from '@nx/devkit';

export const updateCypressTsConfig = (tree: Tree, e2ePath: string) => {
  updateJson(tree, `${e2ePath}/tsconfig.json`, (json) => {
    return {
      ...json,

      compilerOptions: {
        allowJs: true,
        isolatedModules: false,
        strict: true,
        strictNullChecks: true,
        noUncheckedIndexedAccess: true,
        noFallthroughCasesInSwitch: true,
        forceConsistentCasingInFileNames: true,
        types: [
          ...(json?.compilerOptions?.types || []),
          '@testing-library/cypress',
        ],
      },
    };
  });
};

import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  installPackagesTask,
  readJson,
  updateJson,
  workspaceRoot,
  writeJson,
} from '@nx/devkit';
import { Linter } from '@nx/linter';
import { libraryGenerator } from '@nx/react';
import type { GeneLibraryGenerator } from './schema';
import { getNpmScope, updateJestConfig } from '../utilities';
import { relative } from 'path';

export default async function (tree: Tree, schema: GeneLibraryGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');
  const npmScope = getNpmScope(tree);

  const directory = schema.directory ? `${schema.directory}/` : '';

  await libraryGenerator(tree, {
    name: schema.name,
    directory: schema.directory,
    tags: schema.tags,
    linter: Linter.EsLint,
    skipFormat: false,
    skipTsConfig: false,
    style: 'scss',
    compiler: 'babel',
    unitTestRunner: 'jest',
    importPath: `@${npmScope}/${directory}${schema.name}`,
  });

  const pathToProject = `libs/${schema.directory || ''}/${schema.name}`;

  const eslintLibPath = `${pathToProject}/.eslintrc.json`;

  updateJson(tree, eslintLibPath, (currentEsLint) => {
    return {
      ...currentEsLint,
      overrides: [
        ...currentEsLint.overrides,
        {
          files: ['*.ts', '*.tsx'],
          extends: ['plugin:react-hooks/recommended'],
        },
      ],
    };
  });

  const pathToSetupFile = relative(
    pathToProject,
    `${workspaceRoot}/jest.setup.js`,
  );

  updateJestConfig(
    tree,
    pathToProject,
    (currentValues: any) => {
      return {
        ...currentValues,
        setupFilesAfterEnv: [pathToSetupFile],
        transform: {
          '^.+\\.[tj]sx?$': 'ts-jest',
        },
      };
    },
    () => `"globals": {
    "ts-jest": {
      //#region this disables type checking for all test files, though it speeds up the tests significantly
      "isolatedModules": true,
      "diagnostics": {
        "exclude": ["**"],
      }
      //#endregion
    },
  },`,
  );

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

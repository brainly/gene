import {
  formatFiles,
  installPackagesTask,
  readJson,
  Tree,
  updateJson,
  workspaceRoot,
  writeJson,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '@nrwl/react';
import { GeneLibraryGenerator } from './schema';
import { updateJestConfig } from '../utilities';
import { relative } from 'path';

export default async function (tree: Tree, schema: GeneLibraryGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');
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
    `${workspaceRoot}/jest.setup.js`
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
  },`
  );

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

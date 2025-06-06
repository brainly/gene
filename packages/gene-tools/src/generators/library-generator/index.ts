import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  installPackagesTask,
  readJson,
  updateJson,
  workspaceRoot,
  writeJson,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/react';
import type { GeneLibraryGenerator } from './schema';
import { getNpmScope, updateJestConfig } from '../utilities';
import { normalize, relative } from 'path';

export default async function (tree: Tree, schema: GeneLibraryGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');
  const npmScope = getNpmScope(tree);

  const directory = schema.directory ? `${schema.directory}/` : '';
  const projectRoot = schema.directory ? `libs/${schema.directory}/` : '';

  await libraryGenerator(tree, {
    // examples-modules-my-module-module
    name: schema.name,
    // simpleName
    // directory: pathToProject,
    directory,
    tags: schema.tags,
    linter: 'eslint',
    skipFormat: false,
    skipTsConfig: false,
    style: 'scss',
    compiler: 'babel',
    unitTestRunner: 'jest',
    importPath: `@${npmScope}/${directory}${schema.name}`,
    // importPath: `@${npmScope}/${projectRoot}${schema.name}`,
  });

  // const pathToProject = `${directory}${schema.name}`;
  const pathToProject = `${directory}`;
  const eslintLibPath = normalize(`${pathToProject}/.eslintrc.json`);
  // "examples/modules/my-module-module/.eslintrc.json"
  // examples/modules/.eslintrc.json

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

  const workspaceJestSetupPath = relative(
    pathToProject,
    `${workspaceRoot}/jest.setup.js`
  );

  const contents = (tree.read('tsconfig.base.json') || '').toString();
  console.log('🚀 ~ contents:', contents);

  updateJestConfig(
    tree,
    pathToProject,
    (currentValues: any) => {
      return {
        ...currentValues,
        setupFilesAfterEnv: [workspaceJestSetupPath],
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

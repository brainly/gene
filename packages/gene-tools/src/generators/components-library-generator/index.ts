import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readJson,
  updateJson,
  writeJson,
} from '@nx/devkit';
import libraryGenerator from '../library-generator';
import type { BrainlyComponentLibraryGenerator } from './schema';
import storybookConfigurationGenerator from '../storybook-configuration';

import { dasherize } from '@nx/devkit/src/utils/string-utils';

import { resolveTags } from './utils/resolveTags';

const getDirectoryPath = (
  schema: BrainlyComponentLibraryGenerator,
  dasherizedName: string,
  nameWithSuffix: string
) => {
  if (!schema.directory) {
    return `${dasherizedName}/components`;
  } else if (!schema.directory.endsWith('/components')) {
    return `${schema.directory}/components/${nameWithSuffix}`;
  }

  return `${schema.directory}`;
};

export default async function (
  tree: Tree,
  schema: BrainlyComponentLibraryGenerator
) {
  const nameWithSuffix = `${dasherize(schema.name)}-ui`;
  const directoryPath = getDirectoryPath(
    schema,
    dasherize(schema.name),
    nameWithSuffix
  );
  const moduleSourcePath = `${directoryPath}/src/`;
  // const moduleProjectName = `${directoryPath}/${nameWithSuffix}`.replace(
  //   new RegExp('/', 'g'),
  //   '-'
  // );
  const moduleProjectName = nameWithSuffix;
  const currentPackageJson = readJson(tree, 'package.json');

  /**
   * @description
   * Generate components library
   */
  await libraryGenerator(tree, {
    name: nameWithSuffix,
    directory: directoryPath,
    tags: resolveTags(schema),
  });

  tree.delete(moduleSourcePath);

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    moduleSourcePath,
    {}
  );

  /**
   * @description
   * configure storybook for generated library
   */
  await storybookConfigurationGenerator(tree, { name: moduleProjectName });

  const tsconfigPath = joinPathFragments(directoryPath, 'tsconfig.json');

  updateJson(tree, tsconfigPath, (currentTsconfig) => {
    return {
      ...currentTsconfig,
      compilerOptions: {
        ...currentTsconfig.compilerOptions,
        isolatedModules: true,
        esModuleInterop: true,
      },
    };
  });

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

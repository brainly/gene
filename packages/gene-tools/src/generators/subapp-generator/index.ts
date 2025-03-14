import type {
  Tree} from '@nx/devkit';
import {
  formatFiles,
  getProjects,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  readJson,
  writeJson,
} from '@nx/devkit';
import type { SubappGenerator } from './schema';
import { classify, camelize } from '@nx/devkit/src/utils/string-utils';

import { prompt } from 'inquirer';
import libraryGenerator from '../library-generator';
import { reexport } from './utils/reexport';
import { getNpmScope } from '../utilities';

export default async function (tree: Tree, schema: SubappGenerator) {
  const { name, library, directory } = schema;
  const currentPackageJson = readJson(tree, 'package.json');

  let projects = getProjects(tree);

  let moduleProject = projects.get(library);

  if (!moduleProject || !moduleProject.sourceRoot) {
    const shouldGenerateLib = (
      await prompt([
        {
          type: 'confirm',
          name: 'shouldGenerateLib',
          message: `Couldn't find "${library}" library. Do you want to generate it?`,
        },
      ])
    ).shouldGenerateLib;

    if (!shouldGenerateLib) {
      throw new Error(`Library "${library}" was not found`);
    }

    const { libDirectory } = await prompt([
      {
        type: 'input',
        name: 'libDirectory',
        message: `What is the library directory?`,
        default: 'my-domain/my-subfolder',
      },
    ]);

    await libraryGenerator(tree, {
      name: library,
      directory: libDirectory,
      tags: 'type:utility',
    });

    projects = getProjects(tree);

    const moduleProjectName = `${libDirectory}/${library}`.replace(
      new RegExp('/', 'g'),
      '-'
    );

    moduleProject = projects.get(moduleProjectName);

    if (!moduleProject || !moduleProject.sourceRoot) {
      throw new Error(`Error while creating new library.`);
    }
  }

  const npmScope = getNpmScope(tree);

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    joinPathFragments(moduleProject.sourceRoot, `${directory}`),
    {
      ...schema,
      pascalCaseFileName: classify(name),
      camelCaseFileName: camelize(name),
      fileName: name,
      tmpl: '',
      npmScope,
    }
  );

  const reexportIndexPath = `${moduleProject.sourceRoot}/index.ts`;
  const reexportRelativePath = `./${directory}`;

  reexport({
    tree,
    subappName: name,
    reexportIndexPath,
    reexportRelativePath,
  });

  reexport({
    tree,
    subappName: 'types',
    reexportIndexPath,
    reexportRelativePath,
  });

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

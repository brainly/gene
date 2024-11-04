import {
  formatFiles,
  getProjects,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  Tree,
  readJson,
  writeJson,
} from '@nrwl/devkit';
import {SubappGenerator} from './schema';
import {getNpmScope, stringUtils} from '@nrwl/workspace';
import * as inquirer from 'inquirer';
import libraryGenerator from '../library-generator';
import {reexport} from './utils/reexport';

export default async function (tree: Tree, schema: SubappGenerator) {
  const {name, library, directory} = schema;
  const currentPackageJson = readJson(tree, 'package.json');

  let projects = getProjects(tree);

  let moduleProject = projects.get(library);

  if (!moduleProject || !moduleProject.sourceRoot) {
    const shouldGenerateLib = (
      await inquirer.prompt([
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

    const {libDirectory} = await inquirer.prompt([
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const npmScope = getNpmScope(tree);

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    joinPathFragments(moduleProject.sourceRoot, `${directory}`),
    {
      ...schema,
      pascalCaseFileName: stringUtils.classify(name),
      camelCaseFileName: stringUtils.camelize(name),
      fileName: name,
      tmpl: '',
      npmScope
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

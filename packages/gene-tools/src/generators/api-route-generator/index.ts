import {
  formatFiles,
  getProjects,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  Tree,
  readJson,
  writeJson,
} from '@nx/devkit';
import { APIRouteGenerator } from './schema';
import { getNpmScope, stringUtils } from '@nx/workspace';

import { promptSelectAppName, getAllAppKeys } from '../utilities';

export default async function (tree: Tree, schema: APIRouteGenerator) {
  const { name, directory } = schema;

  const currentPackageJson = readJson(tree, 'package.json');

  const app = await promptSelectAppName(
    '',
    tree,
    'What is the app name?',
    getAllAppKeys(tree)
  );
  const projects = getProjects(tree);

  const moduleProject = projects.get(app);

  if (!moduleProject || !moduleProject.sourceRoot) {
    throw new Error(`App "${app}" was not found`);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const npmScope = getNpmScope(tree);

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    joinPathFragments(moduleProject.sourceRoot, `/pages/api/${directory}`),
    {
      ...schema,
      pascalCaseFileName: stringUtils.classify(name),
      fileName: name,
      tmpl: '',
      directory: directory.length > 0 ? `/${directory}` : directory,
      npmScope,
    }
  );

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  installPackagesTask,
  getWorkspaceLayout,
  generateFiles,
  joinPathFragments,
  readJson,
  writeJson,
} from '@nx/devkit';
import libraryGenerator from '../library-generator';
import type { BrainlyServiceGenerator } from './schema';
import {
  classify,
  camelize,
  dasherize,
} from '@nx/devkit/src/utils/string-utils';

import { getNpmScope } from '../utilities';

interface GeneratorOptions {
  name: string;
  targetLocation: string;
  filesLocation: string;
  npmScope?: string | null;
}

function createFiles(
  tree: Tree,
  schema: BrainlyServiceGenerator,
  options: GeneratorOptions
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, options.filesLocation),
    options.targetLocation,
    {
      ...schema,
      npmScope: options.npmScope,
      fileName: classify(schema.name),
      lowerCaseFileName: camelize(schema.name),
      kebabCaseFileName: dasherize(schema.name),
      tmpl: '',
    }
  );
}

const getDirectoryPath = (
  schema: BrainlyServiceGenerator,
  dasherizedName: string
) => {
  if (!schema.directory) {
    return `${dasherizedName}/services`;
  } else if (!schema.directory.endsWith('/services')) {
    return `${schema.directory}/services`;
  }

  return `${schema.directory}`;
};

const getCrudFunctions = (
  serviceName: string,
  schema: BrainlyServiceGenerator
) => {
  const classifiedName = classify(serviceName);

  // Build CRUD functions array from individual flags or existing crudFunctions array
  const selectedChoices: string[] = [];

  // Check individual flags first (priority over crudFunctions array)
  if (
    schema.includeList ||
    schema.includeRead ||
    schema.includeCreate ||
    schema.includeUpdate ||
    schema.includeDelete
  ) {
    if (schema.includeList) selectedChoices.push('list');
    if (schema.includeRead) selectedChoices.push('get');
    if (schema.includeCreate) selectedChoices.push('create');
    if (schema.includeUpdate) selectedChoices.push('update');
    if (schema.includeDelete) selectedChoices.push('delete');
  } else {
    // Default to list if nothing is specified
    selectedChoices.push('list');
  }

  // Map the selected choices to the actual function names
  return selectedChoices.map((choice) => {
    switch (choice) {
      case 'list':
        return `use${classifiedName}s`;
      case 'create':
        return `useCreate${classifiedName}`;
      case 'update':
        return `useUpdate${classifiedName}`;
      case 'delete':
        return `useDelete${classifiedName}`;
      case 'get':
        return `use${classifiedName}`;
      default:
        return `use${classifiedName}s`;
    }
  });
};

export default async function (tree: Tree, schema: BrainlyServiceGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');
  const name = dasherize(schema.name);
  const directory = getDirectoryPath(schema, name);

  let crudFunctions: string[] = [];

  if (schema.serviceType === 'react-query') {
    crudFunctions = getCrudFunctions(name, schema);
  }

  await libraryGenerator(tree, {
    name: `${name}-service`,
    directory: directory,
    tags: ['type:service', ...(schema.tags ? schema.tags.split(',') : [])].join(
      ','
    ),
  });

  /**
   * @description
   * We are using default lib generator but we don't
   * want to have default created files and we would
   * like to create own files.
   */
  const findDefaultCreatedFilePaths = tree
    .listChanges()
    .filter(
      ({ path }) =>
        path.endsWith(`${name}-service.ts`) ||
        path.endsWith(`${name}-service.spec.ts`) ||
        path.endsWith('README.md') ||
        path === 'index.ts'
    )
    .map(({ path }) => path);

  findDefaultCreatedFilePaths.forEach((path) => tree.delete(path));

  /**
   * Getting base options
   */
  const { libsDir } = getWorkspaceLayout(tree);

  const baseOptions = {
    targetLocation: `${libsDir}/${directory}/${name}-service/src`,
    name: name,
  };

  const npmScope = getNpmScope(tree);

  /**
   * @description
   * Generating proper files based on the service type
   */
  switch (schema.serviceType) {
    case 'react-query':
      createFiles(tree, schema, {
        ...baseOptions,
        filesLocation: './react-query/files',
        npmScope,
      });
      break;
    case 'apollo':
    default:
      createFiles(tree, schema, {
        ...baseOptions,
        filesLocation: './apollo/files',
        npmScope,
      });
  }

  if (schema.serviceType === 'react-query') {
    // Remove not needed service hooks
    const findNotNeededServiceHooks = tree
      .listChanges()
      .filter(({ path }) => {
        const filename = path.split('/').pop();
        if (!filename?.startsWith('use')) {
          return false;
        }

        return !crudFunctions.find((crudFunction) =>
          filename?.includes(crudFunction)
        );
      })
      .map(({ path }) => path);

    findNotNeededServiceHooks.forEach((path) => tree.delete(path));

    // Update exports
    const index = tree.read(`${baseOptions.targetLocation}/index.ts`, 'utf-8');
    const lines = index?.split('\n').filter((line) => {
      return crudFunctions.find((crudFunction) => line.includes(crudFunction));
    });
    tree.write(
      `${baseOptions.targetLocation}/index.ts`,
      lines?.join('\n') || ''
    );
  }

  await formatFiles(tree);
  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

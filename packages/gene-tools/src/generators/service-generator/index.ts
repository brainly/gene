import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  readJson,
  writeJson,
} from '@nx/devkit';
import { prompt } from 'inquirer';
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
  const selectedChoices: string[] = [];

  if (schema.useDefaultCrudFunctions) {
    selectedChoices.push('get');
  } else {
    const hasIndividualFlags =
      schema.includeRead ||
      schema.includeCreate ||
      schema.includeUpdate ||
      schema.includeDelete;

    if (hasIndividualFlags) {
      if (schema.includeRead) selectedChoices.push('get');
      if (schema.includeCreate) selectedChoices.push('create');
      if (schema.includeUpdate) selectedChoices.push('update');
      if (schema.includeDelete) selectedChoices.push('delete');
    } else if (schema.crudOperations && schema.crudOperations.length > 0) {
      selectedChoices.push(...schema.crudOperations);
    } else {
      selectedChoices.push('get');
    }
  }

  const functions: string[] = [];
  selectedChoices.forEach((choice) => {
    switch (choice) {
      case 'create':
        functions.push(`useCreate${classifiedName}`);
        break;
      case 'update':
        functions.push(`useUpdate${classifiedName}`);
        break;
      case 'delete':
        functions.push(`useDelete${classifiedName}`);
        break;
      case 'get':
        functions.push(`use${classifiedName}`);
        functions.push(`use${classifiedName}s`);
        break;
      default:
        functions.push(`use${classifiedName}`);
        functions.push(`use${classifiedName}s`);
    }
  });

  return functions;
};

export default async function (tree: Tree, schema: BrainlyServiceGenerator) {
  if (schema.useDefaultCrudFunctions) {
    schema.crudOperations = undefined;
  } else {
    const hasIndividualFlags =
      schema.includeRead ||
      schema.includeCreate ||
      schema.includeUpdate ||
      schema.includeDelete;

    const hasCrudOperations =
      schema.crudOperations && schema.crudOperations.length > 0;

    if (!hasIndividualFlags && !hasCrudOperations) {
      const response = await prompt([
        {
          type: 'checkbox',
          name: 'crudOperations',
          message: 'Which CRUD operations do you want to include?',
          choices: [
            { value: 'get', name: 'Get/Read single item', checked: true },
            { value: 'create', name: 'Create new item' },
            { value: 'update', name: 'Update existing item' },
            { value: 'delete', name: 'Delete item' },
          ],
          validate: (input: string[]) => {
            if (input.length === 0) {
              return 'Please select at least one CRUD operation.';
            }
            return true;
          },
        },
      ]);

      schema.crudOperations = response.crudOperations;
    }
  }

  const currentPackageJson = readJson(tree, 'package.json');
  const name = dasherize(schema.name);
  const directory = getDirectoryPath(schema, name);

  let crudFunctions: string[] = [];

  if (schema.serviceType === 'react-query') {
    crudFunctions = getCrudFunctions(name, schema);
  }

  const serviceName = `${name}-service`;

  await libraryGenerator(tree, {
    name: serviceName,
    directory: `${directory}/${serviceName}`,
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

  const baseOptions = {
    targetLocation: `${directory}/${name}-service/src`,
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

        return !crudFunctions.find((crudFunction) => {
          const fileBaseName = filename.replace('.ts', '');
          return fileBaseName === crudFunction;
        });
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

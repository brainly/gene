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
import inquirer = require('inquirer');

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
  options: GeneratorOptions,
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
      tmpl: '',
    },
  );
}

const getDirectoryPath = (
  schema: BrainlyServiceGenerator,
  dasherizedName: string,
) => {
  if (!schema.directory) {
    return `${dasherizedName}/services`;
  } else if (!schema.directory.endsWith('/services')) {
    return `${schema.directory}/services`;
  }

  return `${schema.directory}`;
};

const promptCrudFunctions = async (
  serviceName: string,
  useDefaultCrudFunctions?: boolean,
) => {
  const classifiedName = classify(serviceName);
  if (useDefaultCrudFunctions) {
    return [`use${classifiedName}s`];
  }

  const { crudFunctions } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'crudFunctions',
      message: `Select CRUD functions you want to generate`,
      choices: [
        {
          name: `use${classifiedName}s - to get multiple ${serviceName}s`,
          value: `use${classifiedName}s`,
          checked: true,
        },
        {
          name: `useCreate${classifiedName} - to create a new ${serviceName}`,
          value: `useCreate${classifiedName}`,
        },
        {
          name: `useUpdate${classifiedName} - to update a single ${serviceName}`,
          value: `useUpdate${classifiedName}`,
        },
        {
          name: `useDelete${classifiedName} - to delete a single ${serviceName}`,
          value: `useDelete${classifiedName}`,
        },
        {
          name: `use${classifiedName} - to get a single ${serviceName}`,
          value: `use${classifiedName}`,
        },
      ],
    },
  ]);

  return crudFunctions;
};

export default async function (tree: Tree, schema: BrainlyServiceGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');
  const name = dasherize(schema.name);
  const directory = getDirectoryPath(schema, name);

  let crudFunctions: string[] = [];

  if (schema.serviceType === 'react-query') {
    crudFunctions = await promptCrudFunctions(
      name,
      schema.useDefaultCrudFunctions,
    );
  }

  await libraryGenerator(tree, {
    name: `${name}-service`,
    directory: directory,
    tags: ['type:service', ...(schema.tags ? schema.tags.split(',') : [])].join(
      ',',
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
        path === 'index.ts',
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
          filename?.includes(crudFunction),
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
      lines?.join('\n') || '',
    );
  }

  await formatFiles(tree);
  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

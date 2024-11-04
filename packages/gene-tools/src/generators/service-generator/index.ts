import {
  Tree,
  formatFiles,
  installPackagesTask,
  getWorkspaceLayout,
  generateFiles,
  joinPathFragments,
  readJson,
  writeJson,
} from '@nrwl/devkit';
import libraryGenerator from '../library-generator';
import {BrainlyServiceGenerator} from './schema';
import {stringUtils} from '@nrwl/workspace';

type GeneratorOptions = {
  name: string;
  targetLocation: string;
  filesLocation: string;
};

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
      fileName: stringUtils.classify(schema.name),
      lowerCaseFileName: stringUtils.camelize(schema.name),
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

export default async function (tree: Tree, schema: BrainlyServiceGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');
  const name = stringUtils.dasherize(schema.name);
  const directory = getDirectoryPath(schema, name);

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
      ({path}) =>
        path.endsWith(`${name}-service.ts`) ||
        path.endsWith(`${name}-service.spec.ts`) ||
        path.endsWith('README.md') ||
        path === 'index.ts'
    )
    .map(({path}) => path);

  findDefaultCreatedFilePaths.forEach(path => tree.delete(path));

  /**
   * Getting base options
   */
  const {libsDir} = getWorkspaceLayout(tree);

  const baseOptions = {
    targetLocation: `${libsDir}/${directory}/${name}-service/src`,
    name: name,
  };
  /**
   * @description
   * Generating proper files based on the service type
   */
  switch (schema.serviceType) {
    case 'react-query':
      createFiles(tree, schema, {
        ...baseOptions,
        filesLocation: './react-query/files',
      });
      break;
    case 'apollo':
    default:
      createFiles(tree, schema, {
        ...baseOptions,
        filesLocation: './apollo/files',
      });
  }

  await formatFiles(tree);
  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readJson,
  Tree,
  updateJson,
  writeJson,
} from '@nrwl/devkit';
import libraryGenerator from '../library-generator';
import {BrainlyComponentLibraryGenerator} from './schema';
import storybookConfigurationGenerator from '../storybook-configuration';
import {dasherize} from '@nrwl/workspace/src/utils/strings';
import {resolveTags} from './utils/resolveTags';

const getDirectoryPath = (
  schema: BrainlyComponentLibraryGenerator,
  dasherizedName: string
) => {
  if (!schema.directory) {
    return `${dasherizedName}/components`;
  } else if (!schema.directory.endsWith('/components')) {
    return `${schema.directory}/components`;
  }

  return `${schema.directory}`;
};

export default async function (
  tree: Tree,
  schema: BrainlyComponentLibraryGenerator
) {
  const nameWithSuffix = `${dasherize(schema.name)}-ui`;
  const directoryPath = getDirectoryPath(schema, dasherize(schema.name));
  const moduleSourcePath = `libs/${directoryPath}/${nameWithSuffix}/src/`;
  const moduleProjectName = `${directoryPath}/${nameWithSuffix}`.replace(
    new RegExp('/', 'g'),
    '-'
  );
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

  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    moduleSourcePath,
    {}
  );

  /**
   * @description
   * configure storybook for generated library
   */
  await storybookConfigurationGenerator(tree, {name: moduleProjectName});

  const tsconfigPath = `libs/${directoryPath}/${nameWithSuffix}/tsconfig.json`;

  updateJson(tree, tsconfigPath, currentTsconfig => {
    return {
      ...currentTsconfig,
      compilerOptions: {
        ...currentTsconfig.compilerOptions,
        isolatedModules: true,
        esModuleInterop: true
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

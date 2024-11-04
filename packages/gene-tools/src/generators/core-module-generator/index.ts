import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readJson,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
  writeJson,
  getNpmPackageSharedConfig,
} from '@nrwl/devkit';
import libraryGenerator from '../library-generator';
import { cypressProjectGenerator } from '@nrwl/storybook';
import { BrainlyCoreModuleGenerator } from './schema';
import storybookConfigurationGenerator from '../storybook-configuration';
import { getNpmScope, stringUtils } from '@nrwl/workspace';
import { Linter } from '@nrwl/linter';
import { updateCypressTsConfig } from '../utilities/update-cypress-json-config';
import { resolveTags } from './utils/resolveTags';

export default async function (tree: Tree, schema: BrainlyCoreModuleGenerator) {
  if (!schema.name) {
    throw Error('Module name is required.');
  }

  const providedTags = resolveTags(schema);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const npmScope = getNpmScope(tree);

  if (!providedTags.includes('domain:')) {
    throw new Error(
      'Domain tag is required, please add tag `domain:<YOUR_DOMAIN_NAME>`. Domain should correspond to product or feature name for given lib. Examples: social-qa, tutoring, answer-platform, ads.'
    );
  }

  const currentPackageJson = readJson(tree, 'package.json');

  const dasherizedName = stringUtils.dasherize(schema.name);
  const nameWithSuffix = `${dasherizedName}-module`;

  const directoryPath = getDirectoryPath(schema, dasherizedName);

  const modulePath = `libs/${directoryPath}/${nameWithSuffix}`;
  const moduleSourcePath = `${modulePath}/src`;
  const moduleProjectName = `${directoryPath}/${nameWithSuffix}`.replace(
    new RegExp('/', 'g'),
    '-'
  );
  const moduleProjectE2EName = `${moduleProjectName}-e2e`;
  const e2ePath = `apps/${moduleProjectE2EName}`;
  const moduleDisplayName = stringUtils.classify(nameWithSuffix);

  const errorBoundary = schema.errorBoundary
    ? moduleDisplayName.replace('Module', '')
    : null;

  /**
   * @description
   * Generate module
   */
  await libraryGenerator(tree, {
    name: nameWithSuffix,
    directory: directoryPath,
    tags: resolveTags(schema),
  });

  // delete default files
  tree.delete(moduleSourcePath);
  tree.delete(`libs/${directoryPath}${nameWithSuffix}/README.md`);

  // create custom module file structure
  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files/module'),
    moduleSourcePath,
    {
      ...schema,
      fileName: nameWithSuffix,
      pascalCaseFileName: moduleDisplayName,
      camelCaseFileName: stringUtils.camelize(nameWithSuffix),
      dataTestId: stringUtils.underscore(`${nameWithSuffix}-id`),
      tmpl: '',
      errorBoundary,
      npmScope
    }
  );

  /**
   * @description
   * configure storybook for generated module
   */
  await storybookConfigurationGenerator(tree, { name: moduleProjectName });

  /**
   * @description
   * generate cypress app for generated module
   */
  await cypressProjectGenerator(tree, {
    name: moduleProjectName,
    linter: Linter.EsLint,
  });

  updateCypressTsConfig(tree, e2ePath);

  // create custom cypress files
  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files/e2e'),
    e2ePath,
    {
      ...schema,
      fileName: nameWithSuffix,
      pascalCaseFileName: stringUtils.classify(nameWithSuffix),
      dataTestId: stringUtils.underscore(`${nameWithSuffix}-id`),
      connectedFileName: stringUtils
        .camelize(nameWithSuffix)
        .toLocaleLowerCase(),
      tmpl: '',
    }
  );

  const e2eProjectConfig = readProjectConfiguration(tree, moduleProjectE2EName);

  updateProjectConfiguration(tree, moduleProjectE2EName, {
    ...e2eProjectConfig,
    targets: {
      ...e2eProjectConfig.targets,
      e2e: {
        executor: '@brainly/gene-tools:e2e-with-serve',
        options: {
          e2eTests: [`${moduleProjectE2EName}:e2e-base`],
          serve: `${moduleProjectName}:storybook-e2e`,
          proxy: false,
        },
      },
      'e2e-base': {
        executor: '@nrwl/cypress:cypress',
        options: {
          cypressConfig: `apps/${moduleProjectE2EName}/cypress.config.ts`,
        },
      },
    },
    tags: [],
  });

  updateJson(
    tree,
    joinPathFragments(e2ePath, './.eslintrc.json'),
    (eslintConfig) => {
      return {
        ...eslintConfig,
        overrides: [
          {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
            rules: {
              'babel/new-cap': 'off',
            },
          },
        ],
      };
    }
  );

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

const getDirectoryPath = (
  schema: BrainlyCoreModuleGenerator,
  dasherizedName: string
) => {
  if (!schema.directory) {
    return `${dasherizedName}/modules`;
  } else if (!schema.directory.endsWith('/modules')) {
    return `${schema.directory}/modules`;
  }

  return `${schema.directory}`;
};

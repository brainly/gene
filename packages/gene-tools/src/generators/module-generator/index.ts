import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
  getProjects,
  ProjectConfiguration,
  readJson,
  writeJson,
} from '@nx/devkit';
import libraryGenerator from '../library-generator';
import { cypressProjectGenerator } from '@nx/storybook';
import { BrainlyModuleGenerator } from './schema';
import storybookConfigurationGenerator from '../storybook-configuration';
import * as stringUtils from '@nx/devkit/src/utils/string-utils';
import { Linter } from '@nx/linter';
import {
  getNpmScope,
  promptBoolean,
  promptSelectAppName,
  updateCypressTsConfig,
} from '../utilities';

const APP_MODULES_LIB_SUFFIX = 'app-modules';

export default async function (tree: Tree, schema: BrainlyModuleGenerator) {
  if (!schema.name) {
    throw Error('Module name is required.');
  }
  const currentPackageJson = readJson(tree, 'package.json');

  const npmScope = getNpmScope(tree);

  const workspaceJsonProjects = [...getProjects(tree)].map(
    ([projectName, project]) =>
      [projectName, project] as [string, ProjectConfiguration]
  );

  const appProjects = workspaceJsonProjects
    .filter(([projectName, project]) => {
      return (
        project.tags?.includes('type:app') && !projectName.endsWith('-e2e')
      );
    })
    .map(([projectName]) => projectName);

  const appName =
    schema.appName ||
    (await promptSelectAppName(
      schema.appName || '',
      tree,
      'For which app would you like to generate the module?',
      appProjects
    ));

  if (!appName) {
    throw new Error('App name is required.');
  }

  const appProject = readProjectConfiguration(tree, appName);

  if (!appProject) {
    throw new Error(`App ${appName} was not found`);
  }

  const { root, tags } = appProject;

  const directoryPath = `${root.replace('apps/', '')}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const moduleLibrary = workspaceJsonProjects.find(([_, project]) => {
    return project.root.endsWith(`${directoryPath}/${APP_MODULES_LIB_SUFFIX}`);
  });

  const dasherizedName = stringUtils.dasherize(schema.name);
  const nameWithSuffix = `${dasherizedName}-module`;

  const modulePath = `libs/${directoryPath}/${APP_MODULES_LIB_SUFFIX}`;
  const moduleSourcePath = `${modulePath}/src`;
  const moduleProjectName =
    `${directoryPath}/${APP_MODULES_LIB_SUFFIX}`.replace(
      new RegExp('/', 'g'),
      '-'
    );
  const moduleProjectE2EName = `${moduleProjectName}-e2e`;
  const e2ePath = `apps/${moduleProjectE2EName}`;

  const moduleAutoprefixedName = stringUtils.classify(
    `${appName}-${nameWithSuffix}`
  );

  const defaultModuleName = stringUtils.classify(nameWithSuffix);

  const shouldAutoprefix =
    typeof schema.shouldAutoprefix === 'boolean'
      ? schema.shouldAutoprefix
      : await promptBoolean(
          `Would you like to autoprefix the module name with the app name? (default: ${defaultModuleName}, autoprefixed: ${moduleAutoprefixedName})
Learn more about modules naming on: https://brainly.github.io/gene/gene/modules/branching#modules-naming`
        );

  const moduleDisplayName = shouldAutoprefix
    ? moduleAutoprefixedName
    : defaultModuleName;

  const errorBoundary = schema.errorBoundary
    ? moduleDisplayName.replace('Module', '')
    : null;

  if (moduleLibrary) {
    console.log(`Module library for app ${appName} already exists.`);
    const scopedPath = `${moduleSourcePath}/lib`;

    await generateFiles(
      tree,
      joinPathFragments(__dirname, './files/module'),
      scopedPath,
      {
        ...schema,
        fileName: nameWithSuffix,
        pascalCaseFileName: moduleDisplayName,
        camelCaseFileName: stringUtils.camelize(nameWithSuffix),
        dataTestId: stringUtils.underscore(`${nameWithSuffix}-id`),
        tmpl: '',
        errorBoundary,
        npmScope,
      }
    );

    const reexportFilePath = `${moduleSourcePath}/index.ts`;

    const existingReexportFile = tree.read(reexportFilePath);

    tree.write(
      reexportFilePath,
      `${existingReexportFile}\nexport {${moduleDisplayName}} from './lib/${nameWithSuffix}';`
    );

    const isE2EProjectExists = workspaceJsonProjects.find(
      ([projectName]) => projectName === moduleProjectE2EName
    );

    if (schema.e2e && isE2EProjectExists) {
      const scopedE2EPath = `${e2ePath}/src/e2e`;

      await generateFiles(
        tree,
        joinPathFragments(__dirname, './files/e2e'),
        scopedE2EPath,
        {
          ...schema,
          fileName: nameWithSuffix,
          pascalCaseFileName: moduleDisplayName,
          dataTestId: stringUtils.underscore(`${nameWithSuffix}-id`),
          connectedFileName: stringUtils
            .camelize(moduleDisplayName)
            .toLocaleLowerCase(),
          tmpl: '',
          npmScope,
        }
      );
    }

    if (schema.e2e && !isE2EProjectExists) {
      await cypressProjectGenerator(tree, {
        name: moduleProjectName,
        linter: Linter.EsLint,
      });

      updateCypressTsConfig(tree, e2ePath);

      // create custom cypress files
      await generateFiles(
        tree,
        joinPathFragments(__dirname, './files/e2e-with-library'),
        e2ePath,
        {
          ...schema,
          fileName: nameWithSuffix,
          pascalCaseFileName: moduleDisplayName,
          dataTestId: stringUtils.underscore(`${nameWithSuffix}-id`),
          connectedFileName: stringUtils
            .camelize(moduleDisplayName)
            .toLocaleLowerCase(),
          tmpl: '',
          npmScope,
        }
      );

      const e2eProjectConfig = readProjectConfiguration(
        tree,
        moduleProjectE2EName
      );

      updateProjectConfiguration(tree, moduleProjectE2EName, {
        ...e2eProjectConfig,
        targets: {
          ...e2eProjectConfig.targets,
          e2e: {
            executor: '@nx/cypress:cypress',
            options: {
              cypressConfig: `apps/${moduleProjectE2EName}/cypress.config.ts`,
              testingType: 'e2e',
              devServerTarget: `${moduleProjectName}:storybook-e2e`,
            },
          },
          'e2e-base': {
            executor: '@nx/cypress:cypress',
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
                  'import/no-extraneous-dependencies': 'off',
                },
              },
            ],
          };
        }
      );
    }

    await formatFiles(tree);

    // revert possible changes to package.json
    writeJson(tree, 'package.json', currentPackageJson);
    return () => {
      installPackagesTask(tree);
    };
  }

  console.log(
    `Module library for app ${appName} was not found in ${modulePath}. Generating...`
  );

  const domainTags = tags?.filter((tag) => tag.startsWith('domain:'));

  const resolvedTags = (domainTags || [])
    .concat('type:module', 'type:application-module-library')
    .join(',');

  /**
   * @description
   * Generate module
   */
  await libraryGenerator(tree, {
    name: APP_MODULES_LIB_SUFFIX,
    directory: directoryPath,
    tags: resolvedTags,
  });

  // delete default files
  tree.delete(moduleSourcePath);
  tree.delete(`libs/${directoryPath}/${APP_MODULES_LIB_SUFFIX}/README.md`);

  // create custom module file structure
  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files/module-with-library'),
    moduleSourcePath,
    {
      ...schema,
      fileName: nameWithSuffix,
      pascalCaseFileName: moduleDisplayName,
      camelCaseFileName: stringUtils.camelize(nameWithSuffix),
      dataTestId: stringUtils.underscore(`${nameWithSuffix}-id`),
      tmpl: '',
      errorBoundary,
      npmScope,
    }
  );

  /**
   * @description
   * configure storybook for generated module
   */
  await storybookConfigurationGenerator(tree, { name: moduleProjectName });

  if (schema.e2e) {
    await cypressProjectGenerator(tree, {
      name: moduleProjectName,
      linter: Linter.EsLint,
    });

    updateCypressTsConfig(tree, e2ePath);

    // create custom cypress files
    await generateFiles(
      tree,
      joinPathFragments(__dirname, './files/e2e-with-library'),
      e2ePath,
      {
        ...schema,
        fileName: nameWithSuffix,
        pascalCaseFileName: moduleDisplayName,
        dataTestId: stringUtils.underscore(`${nameWithSuffix}-id`),
        connectedFileName: stringUtils
          .camelize(moduleDisplayName)
          .toLocaleLowerCase(),
        tmpl: '',
        npmScope,
      }
    );

    const e2eProjectConfig = readProjectConfiguration(
      tree,
      moduleProjectE2EName
    );

    updateProjectConfiguration(tree, moduleProjectE2EName, {
      ...e2eProjectConfig,
      targets: {
        ...e2eProjectConfig.targets,
        e2e: {
          executor: '@nx/cypress:cypress',
          options: {
            cypressConfig: `apps/${moduleProjectE2EName}/cypress.config.ts`,
            testingType: 'e2e',
            devServerTarget: `${moduleProjectName}:storybook-e2e`,
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
                'import/no-extraneous-dependencies': 'off',
              },
            },
          ],
        };
      }
    );
  }

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  getWorkspaceLayout,
  updateJson,
  offsetFromRoot,
  readJson,
  writeJson,
} from '@nrwl/devkit';
import { BrainlyNextJSAppGenerator } from './schema';
import { applicationGenerator } from '@nrwl/next';
import { updateWorkspaceTarget } from './utils/updateWorkspaceTarget';
import { Linter } from '@nrwl/linter';
import { maybeExcludeRewrites } from './utils/maybeExcludeRewrites';
import { resolveTags } from './utils/resolveTags';
import storybookConfigurationGenerator from '../storybook-configuration';
import { updateEslint } from './utils/updateEslint';
import { updateCypressTsConfig } from '../utilities/update-cypress-json-config';
import { getNpmScope, stringUtils } from '@nrwl/workspace';
import { excludeTestsBoilerplate } from './utils/excludeTestsBoilerplate';
import { cleanupFiles } from './utils/cleanupFiles';
import { updateJestConfig } from '../utilities';

export default async function (tree: Tree, schema: BrainlyNextJSAppGenerator) {
  const { name, directory, e2e } = schema;

  const currentPackageJson = readJson(tree, 'package.json');

  await applicationGenerator(tree, {
    name: name,
    directory: directory,
    tags: resolveTags(schema),
    style: 'none',
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    js: false,
    e2eTestRunner: e2e !== false ? 'cypress' : 'none',
  });

  const normalizedDirectory = directory.replace(/\//g, '-');
  const projectName = normalizedDirectory
    ? `${normalizedDirectory}-${name}`
    : name;
  const projectPath = `${directory}/${name}`;
  await updateWorkspaceTarget({ tree, projectPath, projectName, e2e });

  const { appsDir } = getWorkspaceLayout(tree);
  const appDir = `${appsDir}/${projectPath}`;
  const e2eDir = `${appsDir}/${projectPath}-e2e`;
  const initialPage = 'Home';

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const npmScope = getNpmScope(tree);


  generateFiles(tree, joinPathFragments(__dirname, './files/app'), appDir, {
    ...schema,
    tmpl: '',
    apollo: schema.apollo,
    reactQuery: schema.reactQuery,
    rewrites: schema.rewrites,
    projectName,
    dataTestId: stringUtils.underscore(`${initialPage}-id`),
    offsetFromRoot: offsetFromRoot(appDir),
    title: schema.title,
    description: schema.description,
    npmScope
  });

  if (e2e !== false) {
    generateFiles(tree, joinPathFragments(__dirname, './files/e2e'), e2eDir, {
      ...schema,
      fileName: initialPage,
      camelCaseFileName: stringUtils.camelize(initialPage),
      dataTestId: stringUtils.underscore(`${initialPage}-id`),
      connectedFileName: stringUtils.camelize(initialPage).toLocaleLowerCase(),
      tmpl: '',
    });
  }

  if (e2e !== false) {
    updateCypressTsConfig(tree, e2eDir);
  }

  maybeExcludeRewrites(tree, schema);

  if (e2e !== false) {
    excludeTestsBoilerplate(tree);
  }

  updateEslint(tree, appDir);

  if (e2e !== false) {
    updateJson(
      tree,
      joinPathFragments(e2eDir, './.eslintrc.json'),
      (eslintConfig) => {
        return {
          ...eslintConfig,
          overrides: [
            {
              files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
              rules: {
                'babel/new-cap': 'off',
              },
            }
          ],
        };
      }
    );
  }

  await storybookConfigurationGenerator(tree, {
    name: projectName,
  });

  const pathToProject = `apps/${schema.directory || ''}/${schema.name}`;
  updateJestConfig(
    tree,
    pathToProject,
    (currentValues) => {
      return {
        ...currentValues,
        transform: {
          '^.+\\.[tj]sx?$': 'ts-jest',
        },
      };
    },
    () =>
      `"globals": {
        "ts-jest": {
          //#region this disables type checking for all test files, though it speeds up the tests significantly
          "isolatedModules": true,
          "diagnostics": {
            "exclude": ["**"],
          }
          //#endregion
        },
      },
      moduleNameMapper: {
        // openapi3-ts (required by zod-to-openapi) for some reason loads a browser version of yaml by default
        yaml: require.resolve('yaml', {
          paths: [require.resolve('openapi3-ts')],
        }),
      },`
  );

  await formatFiles(tree);

  cleanupFiles(tree, ['pages/_app.tsx', 'pages/index.tsx', 'pages/styles.css']);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

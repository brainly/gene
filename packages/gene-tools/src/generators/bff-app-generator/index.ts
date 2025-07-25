import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  readJson,
  writeJson,
  updateJson,
} from '@nx/devkit';
import type { BrainlyNextJSAppGenerator } from './schema';
import { applicationGenerator } from '@nx/next';
import { updateWorkspaceTarget } from './utils/updateWorkspaceTarget';
import { maybeExcludeRewrites } from './utils/maybeExcludeRewrites';
import { resolveTags } from './utils/resolveTags';
import storybookConfigurationGenerator from '../storybook-configuration';
import { updateEslint } from './utils/updateEslint';
import { underscore, camelize } from '@nx/devkit/src/utils/string-utils';
import { excludeTestsBoilerplate } from './utils/excludeTestsBoilerplate';
import { cleanupFiles } from './utils/cleanupFiles';
import {
  getNpmScope,
  updateCypressTsConfig,
  updateJestConfig,
} from '../utilities';

export default async function (tree: Tree, schema: BrainlyNextJSAppGenerator) {
  const { name: projectName, directory, e2e } = schema;

  const currentPackageJson = readJson(tree, 'package.json');

  await applicationGenerator(tree, {
    name: projectName,
    directory: directory,
    tags: resolveTags(schema),
    style: 'none',
    unitTestRunner: 'jest',
    linter: 'eslint',
    js: false,
    e2eTestRunner: e2e !== false ? 'cypress' : 'none',
    appDir: false,
  });

  await updateWorkspaceTarget({
    tree,
    projectPath: directory,
    projectName,
    e2e,
  });

  const e2eDir = `${directory}-e2e`;
  const initialPage = 'Home';

  const npmScope = getNpmScope(tree);

  generateFiles(tree, joinPathFragments(__dirname, './files/app'), directory, {
    ...schema,
    tmpl: '',
    apollo: schema.apollo,
    reactQuery: schema.reactQuery,
    rewrites: schema.rewrites,
    projectName,
    dataTestId: underscore(`${initialPage}-id`),
    offsetFromRoot: offsetFromRoot(directory),
    title: schema.title,
    description: schema.description,
    npmScope,
  });

  if (e2e !== false) {
    generateFiles(tree, joinPathFragments(__dirname, './files/e2e'), e2eDir, {
      ...schema,
      fileName: initialPage,
      camelCaseFileName: camelize(initialPage),
      dataTestId: underscore(`${initialPage}-id`),
      connectedFileName: camelize(initialPage).toLocaleLowerCase(),
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

  updateEslint(tree, directory);

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
                'import/no-extraneous-dependencies': 'off',
              },
            },
          ],
        };
      }
    );
  }

  await storybookConfigurationGenerator(tree, {
    name: projectName,
  });

  updateJestConfig(
    tree,
    directory,
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

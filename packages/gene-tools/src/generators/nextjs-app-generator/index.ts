import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  getWorkspaceLayout,
  offsetFromRoot,
  readJson,
  writeJson,
  updateJson,
} from '@nx/devkit';
import type { BrainlyNextJSAppGenerator } from './schema';
import { applicationGenerator } from '@nx/next';
import { updateWorkspaceTarget } from './utils/updateWorkspaceTarget';
import { Linter } from '@nx/linter';
import { maybeExcludeRewrites } from './utils/maybeExcludeRewrites';
import { resolveTags } from './utils/resolveTags';
import storybookConfigurationGenerator from '../storybook-configuration';
import { updateEslint } from './utils/updateEslint';

import { underscore, camelize } from '@nx/devkit/src/utils/string-utils';

import { excludeTestsBoilerplate } from './utils/excludeTestsBoilerplate';
import { updateCypressTsConfig } from '../utilities';

export default async function (tree: Tree, schema: BrainlyNextJSAppGenerator) {
  const { name, directory = '', e2e } = schema;
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
    appDir: false,
    src: false,
  });

  const normalizedDirectory = directory.replace(/\//g, '-');
  const projectName = normalizedDirectory
    ? `${normalizedDirectory}-${name}`
    : name;
  const projectPath = `${directory}/${name}`;
  await updateWorkspaceTarget({
    tree,
    projectPath,
    projectName,
    e2e,
    directory: normalizedDirectory,
  });

  const { appsDir } = getWorkspaceLayout(tree);
  const appDir = `${appsDir}/${projectPath}`;
  const e2eDir = `${appsDir}/${projectPath}-e2e`;
  const initialPage = 'Home';

  generateFiles(tree, joinPathFragments(__dirname, './files/app'), appDir, {
    ...schema,
    tmpl: '',
    apollo: schema.apollo,
    reactQuery: schema.reactQuery,
    rewrites: schema.rewrites,
    projectName,
    dataTestId: underscore(`${initialPage}-id`),
    offsetFromRoot: offsetFromRoot(appDir),
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

  maybeExcludeRewrites(tree, schema);

  if (e2e !== false) {
    excludeTestsBoilerplate(tree);
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
                'import/no-extraneous-dependencies': 'off',
              },
            },
          ],
        };
      },
    );
  }
  await storybookConfigurationGenerator(tree, {
    name: projectName,
  });

  await formatFiles(tree);

  // Should we add required dependencies here?
  // addDepsToPackageJson({
  //   "find-up": "^5.0.0",
  //   "mini-css-extract-plugin": "2.2.0",
  //   "@next/bundle-analyzer": "12.3.4",
  //   "reflect-metadata": "0.1.13",
  // })

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

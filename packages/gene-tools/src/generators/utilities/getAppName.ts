import type { Tree } from '@nx/devkit';

import { registerPrompt, prompt } from 'inquirer';

// inquirer-search-list has no type declaration
// https://github.com/robin-rpr/inquirer-search-list
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as inquirerSearchList from 'inquirer-search-list'; // eslint-disable-line import/no-namespace
registerPrompt('search-list', inquirerSearchList);

// inquirer-search-checkbox has no type declaration
// https://github.com/robin-rpr/inquirer-search-list
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as inquirerSearchCheckbox from 'inquirer-search-checkbox'; // eslint-disable-line import/no-namespace
import { getListOfAllProjectKeys } from './treeHelpers';
registerPrompt('search-checkbox', inquirerSearchCheckbox);

export async function promptSelectAppName(
  schemaAppName: string,
  tree: Tree,
  question: string,
  listOfSelectableProjects?: string[],
) {
  let appName = schemaAppName;

  if (!appName) {
    const projects = listOfSelectableProjects ?? getListOfAllProjectKeys(tree);

    appName = (
      await prompt([
        {
          type: 'search-list',
          message: `${question}\r\nType to search`,
          name: 'appName',
          choices: projects,
          default: 'my-module',
        },
      ])
    ).appName;
  }
  return appName;
}

export async function promptSelectMultipleAppNames(
  tree: Tree,
  question: string,
  listOfSelectableProjects?: string[],
) {
  const projects = listOfSelectableProjects ?? getListOfAllProjectKeys(tree);

  const appNames = (
    await prompt([
      {
        type: 'search-checkbox',
        message: `${question}\r\nType to search`,
        name: 'appNames',
        choices: projects,
      },
    ])
  ).appNames;

  return appNames;
}

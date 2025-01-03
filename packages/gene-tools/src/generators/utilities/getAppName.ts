import { Tree } from '@nx/devkit';

import * as inquirer from 'inquirer';

// inquirer-search-list has no type declaration
// https://github.com/robin-rpr/inquirer-search-list
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import inquirerSearchList from 'inquirer-search-list';
inquirer.registerPrompt('search-list', inquirerSearchList);

// inquirer-search-checkbox has no type declaration
// https://github.com/robin-rpr/inquirer-search-list
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import inquirerSearchCheckbox from 'inquirer-search-checkbox';
import { getListOfAllProjectKeys } from './treeHelpers';
inquirer.registerPrompt('search-checkbox', inquirerSearchCheckbox);

export async function promptSelectAppName(
  schemaAppName: string,
  tree: Tree,
  question: string,
  listOfSelectableProjects?: string[]
) {
  let appName = schemaAppName;

  if (!appName) {
    const projects = listOfSelectableProjects ?? getListOfAllProjectKeys(tree);

    appName = (
      await inquirer.prompt([
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
  listOfSelectableProjects?: string[]
) {
  const projects = listOfSelectableProjects ?? getListOfAllProjectKeys(tree);

  const appNames = (
    await inquirer.prompt([
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

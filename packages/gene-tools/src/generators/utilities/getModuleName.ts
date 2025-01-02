import { Tree } from '@nrwl/devkit';

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

export async function promptSelectModuleName(
  tree: Tree,
  question: string,
  listOfSelectableProjects?: string[]
) {
  const projects = (
    listOfSelectableProjects ?? getListOfAllProjectKeys(tree)
  ).filter((project) => project.endsWith('-module'));

  return (
    await inquirer.prompt([
      {
        type: 'search-list',
        message: `${question}\r\nType to search`,
        name: 'moduleName',
        choices: projects,
        default: 'my-module',
      },
    ])
  ).moduleName;
}

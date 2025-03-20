import type { Tree } from '@nx/devkit';

import { registerPrompt, prompt } from 'inquirer';

// inquirer-search-list has no type declaration
// https://github.com/robin-rpr/inquirer-search-list
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import inquirerSearchList from 'inquirer-search-list'; // eslint-disable-line import/no-namespace
registerPrompt('search-list', inquirerSearchList);

// inquirer-search-checkbox has no type declaration
// https://github.com/robin-rpr/inquirer-search-list
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import inquirerSearchCheckbox from 'inquirer-search-checkbox'; // eslint-disable-line import/no-namespace
import { getListOfAllProjectKeys } from './treeHelpers';
registerPrompt('search-checkbox', inquirerSearchCheckbox);

export async function promptSelectModuleName(
  tree: Tree,
  question: string,
  listOfSelectableProjects?: string[]
) {
  const projects = (
    listOfSelectableProjects ?? getListOfAllProjectKeys(tree)
  ).filter((project) => project.endsWith('-module'));

  return (
    await prompt([
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

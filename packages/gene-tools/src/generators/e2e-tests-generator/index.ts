import {
  formatFiles,
  getProjects,
  installPackagesTask,
  readJson,
  Tree,
  writeJson,
} from '@nx/devkit';
import { promptSelectModuleName } from '../utilities';
import { findModuleComponents } from './utils/findModuleComponents';

import * as stringUtils from '@nx/devkit/src/utils/string-utils';

import * as inquirer from 'inquirer';
import { findDataTestIds, processResults } from './utils/findDataTestIds';
import {
  generateGherkinScenarios,
  reflectOnGherkinScenarios,
} from './prompts/generateGherkinScenarios';
import {
  generateCypressCode,
  reflectOnCypressCode,
} from './prompts/generateCypressCode';

import { Configuration, OpenAIApi } from 'openai';
import { findStorybookData } from './utils/findStorybookData';

// import ora from 'ora';

const ora = (text: string) => ({
  start: () => console.log(text),
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
});
const openai = new OpenAIApi(configuration);

/**
 * @flow
 * 1. Pick module and its e2e tests project
 * 2. Gather downstream components and their data-testid to interact
 * 3. Gather storybook urls and scenarios
 * 4. Generate Gherkin scenarios, confront them with developer feedback and valigate using gherkin parser
 * 5. Generate Cypress TS code corresponding with scenarios, confront it with developer and validate using Cypress
 * 6. Save Gherkin scenarios and Cypress TS code in e2e tests project
 */

/**
 * TODO:
 * 1. Gather storybook urls and scenarios and pass to code generation step
 * 2. Add possibility to  use your own gherkin scenarios from the cli input
 * 3. Polish up validation of e2e cypress code
 * 4. Validation step - limit amount of context (do we need entire previous prompt?)
 * 5. Use ora, solve its TS issues
 * 6. Unit tests (reasonable)
 * 7. Components analysis - speedup by excluding SG components
 * 8. Apply Dorian's comments
 * 9. Share token securely
 */
export default async function (tree: Tree) {
  const currentPackageJson = readJson(tree, 'package.json');
  const workspaceJsonProjects = getProjects(tree);

  console.log('Welcome to E2E Tests Generator!');

  const moduleName = await promptSelectModuleName(
    tree,
    'Which module library do you want to generate e2e tests for?'
  );

  const moduleProject = workspaceJsonProjects[moduleName];
  const e2eTestsProject = workspaceJsonProjects[moduleName + '-e2e'];

  if (!moduleProject || !e2eTestsProject) {
    throw new Error(
      `Module "${moduleName}" or its e2e tests does not exist in the workspace!`
    );
  }

  const modulePath = moduleProject.sourceRoot;

  if (!modulePath) {
    throw new Error(
      `Module "${moduleName}" does not have a source root! Please check your project.json file.`
    );
  }

  const storybookData = findStorybookData(modulePath + '/lib');

  let moduleComponent: string;

  const modulesWithinLibrary = findModuleComponents(modulePath);

  if (modulesWithinLibrary.length === 1) {
    moduleComponent = modulesWithinLibrary[0];
  } else {
    moduleComponent = (
      await inquirer.prompt([
        {
          type: 'search-list',
          message:
            'There are several modules in this library. Which one do you want to generate e2e tests for?',
          name: 'moduleComponent',
          choices: modulesWithinLibrary,
        },
      ])
    ).moduleComponent;
  }

  const { moduleDescription } = await inquirer.prompt([
    {
      type: 'input',
      message:
        'Please describe in few words what this module is doing (e.g. "This module is for adding classes, then user is redirected to class view, adding can fail - this force for displaying error message."). This will makes scenarios closer to the real life.',
      name: 'moduleDescription',
    },
  ]);

  ora('Analyzing components inside ' + moduleComponent).start();

  const dataTestIds = processResults(
    await findDataTestIds(`${modulePath}/${moduleComponent}`)
  );

  ora('Generating Gherkin Scenarios').start();

  const gherkinScenarios = await generateGherkin(
    JSON.stringify(dataTestIds),
    moduleDescription
  );
  ora('Generating Cypress code').start();

  const cypressCode = await generateCypress(
    gherkinScenarios,
    JSON.stringify(dataTestIds),
    JSON.stringify(storybookData)
  );

  const dasherizedModuleName = stringUtils.dasherize(
    moduleName.split('/').pop()
  );

  console.log('Writing files...');

  tree.write(
    `${e2eTestsProject.sourceRoot}/integration/${dasherizedModuleName}.feature`,
    gherkinScenarios
  );
  tree.write(
    `${e2eTestsProject.sourceRoot}/integration/${dasherizedModuleName}/integration.ts`,
    cypressCode
  );

  await formatFiles(tree);

  // revert possible changes to package.json
  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

const askForFeedback = async (
  reRunCallback: (considerations: string) => Promise<string>,
  finishedCallback: () => string
) => {
  const change = (
    await inquirer.prompt([
      {
        type: 'confirm',
        message: 'Is there anything you want to change about the results?',
        name: 'change',
      },
    ])
  ).change;

  if (change) {
    const considerations = (
      await inquirer.prompt([
        {
          type: 'input',
          message: 'What would you like to change?',
          name: 'considerations',
        },
      ])
    ).considerations;
    return reRunCallback(considerations);
  }
  return finishedCallback();
};

const generateGherkin = async (
  dataTestIds: string,
  devDescription: string,
  gherkinScenarios?: string,
  considerations?: string
): Promise<string> => {
  let resultGherkinScenarios: string;
  if (considerations && gherkinScenarios) {
    resultGherkinScenarios = await reflectOnGherkinScenarios({
      openai,
      componentDescriptions: dataTestIds,
      previousOutput: gherkinScenarios,
      devDescription,
      considerations: considerations,
    });
  } else {
    resultGherkinScenarios = await generateGherkinScenarios({
      openai,
      componentDescriptions: dataTestIds,
      devDescription,
    });
  }

  console.log('--------- Your Gherkin Scenarios --------- \r\n');
  console.log(resultGherkinScenarios, '\r\n');
  console.log('--------- ---------------------- --------- \r\n');

  return await askForFeedback(
    (considerations) => {
      return generateGherkin(
        JSON.stringify(dataTestIds),
        devDescription,
        resultGherkinScenarios,
        considerations
      );
    },
    () => {
      return resultGherkinScenarios;
    }
  );
};

const generateCypress = async (
  gherkinScenarios: string,
  dataTestIds: string,
  storybookData: string,
  considerations?: string
): Promise<string> => {
  let resultCypressCode: string;
  if (considerations) {
    resultCypressCode = await reflectOnCypressCode(
      openai,
      gherkinScenarios,
      dataTestIds,
      storybookData,
      considerations
    );
  } else {
    resultCypressCode = await generateCypressCode(
      openai,
      gherkinScenarios,
      dataTestIds,
      storybookData
    );
  }

  console.log('--------- Your Cypress Code --------- \r\n');
  console.log(resultCypressCode, '\r\n');
  console.log('--------- ---------------------- --------- \r\n');

  return await askForFeedback(
    (considerations) => {
      return generateCypress(
        gherkinScenarios,
        dataTestIds,
        storybookData,
        considerations
      );
    },
    () => {
      return resultCypressCode;
    }
  );
};

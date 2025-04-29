import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  installPackagesTask,
  getProjects,
  generateFiles,
  joinPathFragments,
  readJson,
  writeJson,
} from '@nx/devkit';
import type { BrainlyComponentGenerator } from './schema';
import { resolveDynamicOptions } from './utils/resolveDynamicOptions';
import { reexport } from './utils/reexport';
import { prompt } from 'inquirer';
import { readdirSync } from 'fs';
import { camelCase, upperFirst } from 'lodash';
import { promptSelectAppName } from '../utilities/getAppName';
import { classify } from '@nx/devkit/src/utils/string-utils';
import { getComponentTemplateVariables } from './utils/getComponentTemplateVariables';
import type { ComponentPromptsProfileType } from './utils/resolveDynamicOptions';

export default async function (tree: Tree, schema: BrainlyComponentGenerator) {
  const currentPackageJson = readJson(tree, 'package.json');
  const projects = getProjects(tree);

  let promptsProfile: ComponentPromptsProfileType;

  if (schema.promptsProfile) {
    promptsProfile = schema.promptsProfile;
  } else {
    const answer = await prompt([
      {
        name: 'promptsProfile',
        type: 'list',
        message:
          'You will create a new component now. Which prompting options would you like to choose?',
        choices: [
          {
            value: 'basic',
            name: 'I would like to create a basic component (only name).',
          },
          {
            value: 'sample',
            name: 'I would like to create a basic component with defaults for props, events, copy, styles.',
          },
          {
            value: 'advanced',
            name: 'I would like to create an advanced component (name, props, events, copy, styles).',
          },
        ],
      },
    ]);
    promptsProfile = answer.promptsProfile;
  }

  const libraryName = await promptSelectAppName(
    schema.library ?? '',
    tree,
    'What is name of library in which you want to create a component?'
  );

  const library = projects.get(libraryName);

  if (!library) {
    throw new Error('No library found.');
  }

  const { sourceRoot, root, tags } = library;

  if (!sourceRoot) {
    throw new Error('No library found.');
  }

  let directory = 'lib';

  if (tags?.includes('type:app')) {
    directory = 'components';
  }

  if (tags?.includes('type:module')) {
    const variants = readdirSync(`${sourceRoot}/lib`).filter(
      (entry) => !entry.includes('.')
    );

    const isModuleLibrary = tags?.includes('type:application-module-library');

    const { chosenVariant } = await prompt([
      {
        type: 'list',
        name: 'chosenVariant',
        message: isModuleLibrary
          ? 'In which module the component should be created?'
          : 'Module inheritors encountered. In which module variation the component should be created?',
        choices: variants,
      },
    ]);

    directory = `lib/${chosenVariant}/components`;
  }

  if (schema.library === 'components') {
    directory = 'src';
  }

  const directoryPath = `${sourceRoot}/${directory}`;
  const reexportIndexPath = `${sourceRoot}/index.ts`;
  const reexportRelativePath = `./${directory}`;
  const libraryShortName = root.split('/').pop();

  const generatorOptions = await resolveDynamicOptions({
    ...schema,
    promptsProfile,
    reexportIndexPath,
    reexportRelativePath,
    directory: directoryPath,
    reexport: false,
    libraryShortName,
  });

  if (!generatorOptions.name) {
    throw new Error('Name for the component was not provided');
  }

  const templateVariables = getComponentTemplateVariables(generatorOptions);

  await generateFiles(
    tree,
    joinPathFragments(__dirname, './templates'),
    `${generatorOptions.directory}/${classify(generatorOptions.name)}`,
    {
      ...generatorOptions,
      ...templateVariables,
      filename: classify(generatorOptions.name),
      tmpl: '',
    }
  );

  const reexportFileName = upperFirst(camelCase(generatorOptions.name));

  reexport({
    tree,
    componentName: reexportFileName,
    reexportIndexPath,
    reexportRelativePath,
  });

  await formatFiles(tree);

  writeJson(tree, 'package.json', currentPackageJson);
  return () => {
    installPackagesTask(tree);
  };
}

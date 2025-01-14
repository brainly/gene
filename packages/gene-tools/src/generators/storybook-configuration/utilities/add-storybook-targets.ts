import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { NormalizedOptions } from '../schema';

export function addStorybookTargets(
  tree: Tree,
  options: NormalizedOptions
): void {
  const projectConfig = readProjectConfiguration(tree, options.name);

  projectConfig.targets = {
    ...projectConfig.targets,
    storybook: {
      executor: '@brainly-gene/tools:storybook',
      options: {
        command: 'start',
      },
    },
    'storybook-e2e': {
      executor: '@brainly-gene/tools:storybook',
      options: {
        command: 'start',
        e2e: true,
      },
    },
    'build-storybook': {
      executor: '@brainly-gene/tools:storybook',
      options: {
        command: 'build',
      },
    },
    'copy-storybook-images': {
      executor: '@brainly-gene/tools:copy-assets-to-storybook',
    },
    'copy-storybook-translations': {
      executor: '@brainly-gene/tools:copy-translations-to-storybook',
    },
    'nrwl-storybook': {
      executor: '@nx/storybook:storybook',
      dependsOn: [
        {
          target: 'copy-storybook-images',
          projects: 'self',
        },
        {
          target: 'copy-storybook-translations',
          projects: 'self',
        },
      ],
      options: {
        uiFramework: '@storybook/react',
        port: 4400,
        config: {
          configFolder: options.storybookDir,
        },
        configDir: options.storybookDir,
        staticDir: ['.storybook/assets'],
      },
      configurations: { ci: { quiet: true } },
    },
    'build-nrwl-storybook': {
      executor: '@nx/storybook:build',
      dependsOn: [
        {
          target: 'copy-storybook-images',
          projects: 'self',
        },
        {
          target: 'copy-storybook-translations',
          projects: 'self',
        },
      ],
      outputs: ['{options.outputPath}'],
      options: {
        uiFramework: '@storybook/react',
        outputPath: `dist/storybook/${options.name}`,
        config: { configFolder: options.storybookDir },
        configDir: options.storybookDir,
        staticDir: ['.storybook/assets'],
      },
      configurations: { ci: { quiet: true } },
    },
  };

  updateProjectConfiguration(tree, options.name, projectConfig);
}

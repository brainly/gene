import type { Tree } from '@nx/devkit';
import {
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import type { NormalizedOptions } from '../schema';

export function addStorybookTargets(
  tree: Tree,
  options: NormalizedOptions
): void {
  const projectConfig = readProjectConfiguration(tree, options.name);

  projectConfig.targets = {
    ...projectConfig.targets,
    'storybook-e2e': {
      executor: '@brainly-gene/tools:storybook',
      options: {
        command: 'start',
        e2e: true,
      },
    },
    'copy-storybook-images': {
      executor: '@brainly-gene/tools:copy-assets-to-storybook',
    },
    'copy-storybook-translations': {
      executor: '@brainly-gene/tools:copy-translations-to-storybook',
    },
    storybook: {
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
        port: 4400,
        config: {
          configFolder: options.storybookDir,
        },
        configDir: options.storybookDir,
      },
      configurations: { ci: { quiet: true } },
    },
    'build-storybook': {
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
        outputPath: `dist/storybook/${options.name}`,
        config: { configFolder: options.storybookDir },
      },
      configurations: { ci: { quiet: true } },
    },
  };

  updateProjectConfiguration(tree, options.name, projectConfig);
}

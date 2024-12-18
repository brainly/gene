import { formatFiles, logger, Tree } from '@nx/devkit';
import { Options } from './schema';
import {
  addStorybookTargets,
  excludeStoriesFromProjectTsConfig,
  generateConfigurationFiles,
  normalizeOptions,
} from './utilities';
import { hasFilesInTheFolder } from '../utilities';

export async function storybookConfigurationGenerator(
  tree: Tree,
  rawOptions: Options
) {
  const options = normalizeOptions(tree, rawOptions);

  if (
    tree.exists(options.storybookDir) &&
    hasFilesInTheFolder(tree, options.storybookDir)
  ) {
    logger.warn(
      `The ".storybook" folder already exists for "${options.name}"! Skipping configuration.`
    );
    return;
  }

  generateConfigurationFiles(tree, options);
  excludeStoriesFromProjectTsConfig(tree, options);
  addStorybookTargets(tree, options);

  await formatFiles(tree);
}

export default storybookConfigurationGenerator;

import type { Tree} from '@nx/devkit';
import { readJson, writeJson } from '@nx/devkit';
import type { NormalizedOptions } from '../schema';

export function excludeStoriesFromProjectTsConfig(
  tree: Tree,
  options: NormalizedOptions
): void {
  const tsConfigPath = getTsConfigPath(tree, options);
  const tsConfigContent = readJson(tree, tsConfigPath);

  tsConfigContent.exclude = [
    ...(tsConfigContent.exclude || []),
    '**/*.stories.ts',
    '**/*.stories.js',
    '**/*.stories.jsx',
    '**/*.stories.tsx',
  ];

  writeJson(tree, tsConfigPath, tsConfigContent);
}

function getTsConfigPath(tree: Tree, options: NormalizedOptions): string {
  const path = options.isLibrary
    ? `${options.projectRoot}/tsconfig.lib.json`
    : `${options.projectRoot}/tsconfig.app.json`;

  if (tree.exists(path)) {
    return path;
  }

  return `${options.projectRoot}/tsconfig.json`;
}

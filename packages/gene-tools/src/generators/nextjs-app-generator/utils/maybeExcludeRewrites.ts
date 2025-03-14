import type { Tree } from '@nx/devkit';
import type { BrainlyNextJSAppGenerator } from '../schema';

export const maybeExcludeRewrites = (
  tree: Tree,
  schema: BrainlyNextJSAppGenerator
) => {
  if (!schema.rewrites) {
    const rewriteFilePath = tree
      .listChanges()
      .map(({ path }) => path)
      .find(
        (path) =>
          path.endsWith('rewrites.json') || path.endsWith('loadRewrites.js')
      );

    if (rewriteFilePath) {
      tree.delete(rewriteFilePath);
    }
  }
};

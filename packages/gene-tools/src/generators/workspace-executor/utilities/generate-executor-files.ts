import type { Tree } from '@nx/devkit';
import { generateFiles, joinPathFragments } from '@nx/devkit';

interface Names {
  className: string;
  name: string;
}

export function generateExecutorFiles(tree: Tree, options: Names): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files'),
    joinPathFragments('tools/executors', options.name),
    { ...options, tmpl: '' }
  );
}

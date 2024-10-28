import {generateFiles, joinPathFragments, Tree} from '@nrwl/devkit';

interface Names {
  className: string;
  name: string;
}

export function generateExecutorFiles(tree: Tree, options: Names): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '../files'),
    joinPathFragments('tools/executors', options.name),
    {...options, tmpl: ''}
  );
}

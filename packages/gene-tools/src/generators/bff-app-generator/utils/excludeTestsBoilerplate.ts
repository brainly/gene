import {Tree} from '@nrwl/devkit';

export const excludeTestsBoilerplate = (tree: Tree) => {
  const e2eBoilerplatePaths = tree
    .listChanges()
    .map(({path}) => path)
    .filter(
      path =>
        path.endsWith('support/app.po.ts') ||
        path.endsWith('integration/app.spec.ts') ||
        path.endsWith('index.spec.tsx')
    );

  e2eBoilerplatePaths.forEach(path => tree.delete(path));
};

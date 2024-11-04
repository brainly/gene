import {readJson, Tree} from '@nrwl/devkit';

export function validateExecutor(tree: Tree, name: string) {
  const executors = readJson(tree, 'tools/executors/executors.json');

  if (executors.executors[name]) {
    throw new Error(`Executor "${name}" already exists.`);
  }
}

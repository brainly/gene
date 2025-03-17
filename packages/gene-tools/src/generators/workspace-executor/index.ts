import type { Tree } from '@nx/devkit';
import { formatFiles, names } from '@nx/devkit';
import {
  addExecutor,
  generateExecutorFiles,
  updateReadmeExecutorList,
  validateExecutor,
} from './utilities';

export interface WorkspaceExecutorOptions {
  name: string;
}

export default async function workspaceExecutorGenerator(
  tree: Tree,
  rawOptions: WorkspaceExecutorOptions,
): Promise<void> {
  const { className, fileName: name } = names(rawOptions.name);
  validateExecutor(tree, name);

  generateExecutorFiles(tree, { className, name });
  addExecutor(tree, name);
  updateReadmeExecutorList(tree, name);

  await formatFiles(tree);
}

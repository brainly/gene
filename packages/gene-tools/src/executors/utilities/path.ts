import { workspaceRoot } from '@nx/devkit';
import { resolve } from 'path';

export function toAbsolute(path: string): string {
  return resolve(workspaceRoot, path);
}

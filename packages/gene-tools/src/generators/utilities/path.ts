
import { workspaceRoot } from '@nrwl/devkit';
import {resolve, relative} from 'path';

export function toAbsolute(path: string): string {
  return resolve(workspaceRoot, path);
}

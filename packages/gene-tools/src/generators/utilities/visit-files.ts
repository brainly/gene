import {readdirSync, statSync} from 'fs';
import {join} from 'path';
import {toAbsolute} from './path';

export function visitFiles(
  dirPath: string,
  visitor: (path: string) => void
): void {
  readdirSync(toAbsolute(dirPath)).forEach(child => {
    const childPath = join(dirPath, child);
    const stats = statSync(childPath);

    if (!stats.isDirectory()) {
      visitor(childPath);
    } else {
      visitFiles(childPath, visitor);
    }
  });
}

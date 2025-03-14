import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Recursively search for files in a directory that match the specified pattern.
 * @param dirPath Directory path to start the search.
 * @param pattern File pattern to match.
 */
function findFilesInDir(dirPath: string, pattern: RegExp): string[] {
  let results: string[] = [];

  if (!dirPath || !existsSync(dirPath)) {
    return results;
  }

  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }

  return results;
}

/**
 * Checks if the file contains a React component with a name ending in "Module".
 * @param filePath Path of the file to check.
 */
function containsModuleComponent(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf8');
  const moduleComponentPattern = /function\s+\w+Module\s*\(/g;
  return moduleComponentPattern.test(content);
}

/**
 * Finds all React components in a directory with a name ending in "Module".
 * @param dirPath Directory path to start the search.
 */
export function findModuleComponents(dirPath: string): string[] {
  const tsxFiles = findFilesInDir(dirPath, /\.(tsx|ts)$/);

  return tsxFiles
    .filter(containsModuleComponent)
    .map(filePath => filePath.replace(dirPath + '/', ''));
}

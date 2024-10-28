import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively search for files in a directory that match the specified pattern.
 * @param dirPath Directory path to start the search.
 * @param pattern File pattern to match.
 */
function findFilesInDir(dirPath: string, pattern: RegExp): string[] {
  let results: string[] = [];

  if (!dirPath || !fs.existsSync(dirPath)) {
    return results;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

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
  const content = fs.readFileSync(filePath, 'utf8');
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

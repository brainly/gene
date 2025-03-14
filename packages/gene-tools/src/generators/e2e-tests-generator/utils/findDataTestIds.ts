import { readFileSync } from 'fs';
import type { Literal } from 'jscodeshift';
import { withParser } from 'jscodeshift';
import { sync } from 'glob';

interface Result {
  componentName: string;
  dataTestId: string;
  dataTestIdElementName: string;
}

interface FileToProcess {
  path: string;
  depth: number;
}

function isFirstLetterCapital(str: string | null) {
  // Check if the string is empty
  if (!str) {
    return false;
  }

  // Get the first character of the string
  const firstChar = str[0];

  // Check if the first character is the same as its uppercase version and different from its lowercase version
  return (
    firstChar === firstChar?.toUpperCase() &&
    firstChar !== firstChar?.toLowerCase()
  );
}

async function extractDataTestIdsFromFile(
  componentPath: string,
): Promise<Result[]> {
  const j = withParser('tsx');
  const content = readFileSync(componentPath, 'utf8');
  const root = j(content);
  const results: Result[] = [];

  root
    .find(j.JSXAttribute, {
      name: {
        type: 'JSXIdentifier',
        name: 'data-testid',
      },
    })
    .forEach((attrPath) => {
      if (
        attrPath.parentPath.node.type === 'JSXOpeningElement' &&
        attrPath.parentPath.node.name.type === 'JSXIdentifier'
      ) {
        results.push({
          componentName:
            componentPath
              .split('/')
              .pop()
              ?.replace(/\.tsx$/, '') || '',
          dataTestId: (attrPath.node.value as Literal).value as string,
          dataTestIdElementName: attrPath.parentPath.node.name.name,
        });
      }
    });

  return results;
}

export function processResults(results: Result[]): Result[] {
  // Filter out components with 'Module' in the name
  const filteredResults = results.filter(
    (result) => !result.componentName.includes('Module') && !!result.dataTestId,
  );

  // Remove duplicates based on dataTestId
  const uniqueResults: Result[] = [];
  const seenDataTestIds = new Set<string>();

  for (const result of filteredResults) {
    if (!seenDataTestIds.has(result.dataTestId)) {
      seenDataTestIds.add(result.dataTestId);
      uniqueResults.push(result);
    }
  }

  return uniqueResults;
}

export async function findDataTestIds(
  componentPath: string,
  maxDepth = 2,
): Promise<Result[]> {
  const processedFiles: string[] = [];
  const toProcess: FileToProcess[] = [{ path: componentPath, depth: 0 }];
  const results: Result[] = [];

  while (toProcess.length > 0) {
    const currentFileObject = toProcess.pop();

    if (!currentFileObject) {
      continue;
    }

    const currentFile = currentFileObject.path;
    const currentDepth = currentFileObject.depth;

    if (processedFiles.includes(currentFile) || currentDepth > maxDepth) {
      continue;
    }

    const extractedData = await extractDataTestIdsFromFile(currentFile);
    results.push(...extractedData);

    const j = withParser('tsx');
    const content = readFileSync(currentFile, 'utf8');
    const root = j(content);

    // Find components returned by the render function
    root.find(j.JSXElement).forEach((path) => {
      const openingElement = path.node.openingElement;
      if (openingElement && openingElement.name.type === 'JSXIdentifier') {
        const componentName = openingElement.name.name;

        if (!isFirstLetterCapital(componentName)) {
          return;
        }

        const globPattern = `{packages,apps,libs}/**/${
          componentName.endsWith('Component')
            ? `{${componentName.replace('Component', '')},${componentName}}`
            : componentName
        }.ts?(x)`;

        const componentFiles = sync(globPattern);

        toProcess.push(
          ...componentFiles.map((filePath: string) => ({
            path: filePath,
            depth: currentDepth + 1,
          })),
        );
      }
    });

    processedFiles.push(currentFile);
  }

  return results;
}

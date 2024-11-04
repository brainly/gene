import * as fs from 'fs';
import * as path from 'path';

function extractStories(fileContent: string): Record<string, string> {
  const stories: Record<string, string> = {};

  const featureRegex = /(^|\W)storiesOf\('([\w\s-]+)'/g;
  const scenarioRegex =
    /\.add\(\s*'([\w\s-]+)',\s*\(\) => \{?[^}]*?<AchievementsModule[^}]*?/g;

  const featureMatch = featureRegex.exec(fileContent);

  if (featureMatch) {
    const feature = featureMatch[1];

    let scenarioMatch;
    while ((scenarioMatch = scenarioRegex.exec(fileContent)) !== null) {
      const scenario = scenarioMatch[1];

      console.log('scenario', scenario, feature);

      const scenarioId = `${feature.toLowerCase()}--${scenario
        .replace(/\s+/g, '-')
        .toLowerCase()}`;
      stories[scenario] = `/iframe.html?id=${scenarioId}`;
    }
  }

  return stories;
}

function getStorybookFilesFromDir(root: string): string[] {
  const files: string[] = [];

  function traverse(dir: string): void {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        traverse(fullPath);
      } else if (
        file.endsWith('.stories.tsx') ||
        file.endsWith('.stories.ts')
      ) {
        files.push(fullPath);
      }
    });
  }

  traverse(root);
  return files;
}

export function findStorybookData(sourceRoot: string): Record<string, string> {
  const storybookFiles = getStorybookFilesFromDir(sourceRoot);

  let allStories: Record<string, string> = {};

  for (const file of storybookFiles) {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const stories = extractStories(fileContent);
    allStories = {...allStories, ...stories};
  }

  return allStories;
}

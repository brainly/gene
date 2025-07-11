import type { Tree } from '@nx/devkit';
import {
  generateFiles,
  installPackagesTask,
  joinPathFragments,
} from '@nx/devkit';
import assetsLibraryGenerator from '../assets-library-generator';
import translationsLibraryGenerator from '../translations-library-generator';

export default async function (tree: Tree) {
  // Create empty apps and libs directories
  tree.write('apps/.gitkeep', '');
  tree.write('libs/.gitkeep', '');

  try {
    await assetsLibraryGenerator(tree, {
      withStyleGuide: true,
    });

    await translationsLibraryGenerator(tree);

    generateFiles(tree, joinPathFragments(__dirname, './files'), './', {});
  } catch (error) {
    console.error('Error creating assets library:', error);
  }

  // Update .eslintrc.json
  const updatedEslintJson = `
  {
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nx", "@brainly-gene"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              }
            ]
          }
        ]
      }
    },
    {
      "files": ["*.ts", "*.tsx"],
      "extends": ["plugin:@brainly-gene/eslint-plugin/basic"],
      "rules": {}
    },
    {
      "files": ["*.js", "*.jsx"],
      "extends": ["plugin:@nx/javascript"],
      "rules": {
        "@nx/enforce-module-boundaries": ["off"]
      }
    },
    {
      "files": ["*.spec.ts", "*.spec.tsx", "*.spec.js", "*.spec.jsx"],
      "env": {
        "jest": true
      },
      "rules": {}
    }
  ]
}
`;

  tree.write('.eslintrc.json', updatedEslintJson);

  // Update .gitignore to ignore .storybook/assets
  const gitignore = tree.read('.gitignore', 'utf-8');
  const updatedGitignore = gitignore + '\n.storybook/assets';
  tree.write('.gitignore', updatedGitignore);

  // Create empty jest.setup.js file in the root
  tree.write('jest.setup.js', 'module.exports = {};');

  return () => {
    installPackagesTask(tree);
  };
}

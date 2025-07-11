import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import geneWorkspaceGenerator from './index';

describe('gene-workspace generator', () => {
  it('should generate files without double slash issues', async () => {
    const tree = createTreeWithEmptyWorkspace();

    // Add basic files that the generator expects
    tree.write(
      'package.json',
      JSON.stringify({
        name: 'test-workspace',
        version: '1.0.0',
      })
    );

    tree.write(
      'nx.json',
      JSON.stringify({
        npmScope: 'test',
      })
    );

    console.log('🔍 Before running generator:');
    console.log('Tree changes:', tree.listChanges());

    await geneWorkspaceGenerator(tree);

    console.log('🔍 After running generator:');
    console.log('Tree changes:', tree.listChanges());

    // Check if the problematic file exists
    const eslintPath = 'libs/assets/.eslintrc.json';
    const hasEslintFile = tree.exists(eslintPath);
    console.log(
      `\n🔍 Checking for ${eslintPath}: ${
        hasEslintFile ? '✅ EXISTS' : '❌ MISSING'
      }`
    );

    if (hasEslintFile) {
      console.log('📄 ESLint file content:');
      console.log(tree.read(eslintPath, 'utf-8'));
    }

    // List all files in libs/assets
    console.log('\n📂 Files in libs/assets:');
    if (tree.exists('libs/assets')) {
      // Use the correct method to list directory contents
      const changes = tree.listChanges();
      const assetsFiles = changes
        .filter((change) => change.path.startsWith('libs/assets/'))
        .map((change) => change.path);
      console.log(assetsFiles);
    } else {
      console.log('❌ libs/assets directory does not exist');
    }

    // The test should pass if no double slash issues
    expect(hasEslintFile).toBe(true);
  });
});

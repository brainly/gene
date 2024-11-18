#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to read dependencies and devDependencies from package.json
function getPackageVersion(packageName) {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return dependencies[packageName] || devDependencies[packageName] || 'latest';
}

// Function to execute a command and display its output in real-time
function execCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, args, { stdio: 'inherit', shell: true });

    cmd.on('error', (error) =>
      reject(`Error executing command: ${error.message}`)
    );
    cmd.on('close', (code) => {
      if (code !== 0) {
        reject(`Command failed with exit code ${code}`);
      } else {
        resolve();
      }
    });
  });
}

// Get the name argument from the command line
const name = process.argv[2];

if (!name) {
  console.error('Please provide a name as an argument.');
  process.exit(1);
}

// Retrieve the NX version
const nxVersion = getPackageVersion('@nx/workspace');

if (nxVersion === 'latest') {
  console.error('NX version not found in package.json.');
  process.exit(1);
}

console.log(`Creating workspace ${name} with NX version ${nxVersion}...`);

// Define an async function to run multiple commands in sequence
async function runCommands() {
  try {
    // Use the NX version and name argument in the command
    await execCommand('npx', [
      `create-nx-workspace@${nxVersion}`,
      `--name=${name}`,
      '--preset=apps',
      '--workspaceType=integrated',
      '--interactive=false',
      '--nxCloud=false',
    ]);

    console.log(
      `Workspace ${name} created successfully with NX version ${nxVersion}!`
    );

    console.log(`Changing directory to ${name}`);
    process.chdir(name);

    console.log('Installing dependencies with pnpm');

    // List of dependencies to install
    const dependencies = [
      '@brainly-gene/core',
      '@brainly-gene/next',
      'next',
      'ramda',
      'react',
      'react-dom',
      'brainly-style-guide',
      'inversify',
      '@tanstack/react-query',
      '@nx/next',
      'style-loader',
      'css-loader',
      'sass',
      'sass-loader',
      'classnames',
    ];

    const dependencyArgs = dependencies.map(
      (pkg) => `${pkg}@${getPackageVersion(pkg)}`
    );
    await execCommand('pnpm', ['install', ...dependencyArgs]);

    // List of devDependencies to install
    console.log('Installing dev dependencies with pnpm');
    const devDependencies = [
      '@brainly-gene/tools',
      '@brainly-gene/eslint-plugin',
      'eslint',
      '@types/react',
      '@types/ramda',
      '@types/node',
      'eslint-plugin-cypress',
      '@nx/eslint-plugin',
      'eslint-plugin-react-hooks',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-config-next',
      '@nx/jest',
      'msw',
      'msw-storybook-addon',
      '@storybook/addon-actions',
      '@storybook/core-server',
      '@storybook/addon-backgrounds',
      '@storybook/addon-knobs',
      '@storybook/addon-links',
      '@storybook/addon-storysource',
      '@storybook/addon-viewport',
      '@storybook/addons',
      '@storybook/builder-webpack5',
      '@storybook/manager-webpack5',
      '@storybook/react',
      '@storybook/theming',
      '@testing-library/dom',
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@nx/cypress',
      '@nx/react',
      '@nx/web',
      '@types/jest',
      'cypress'
    ];

    const devDependencyArgs = devDependencies.map(
      (pkg) => `${pkg}@${getPackageVersion(pkg)}`
    );
    await execCommand('pnpm', ['install', '-D', ...devDependencyArgs]);

    console.log('Generating gene-workspace with pnpm nx');
    await execCommand('pnpm', [
      'nx',
      'g',
      '@brainly-gene/tools:gene-workspace',
    ]);

    console.log('Generating e2e testing providers');
    await execCommand('pnpm', ['nx', 'g', '@brainly-gene/tools:e2e-providers']);
  } catch (error) {
    console.error(error);
  }
}

// Run the commands
runCommands();

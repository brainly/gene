#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to read the NX version from package.json
function getNxVersion() {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.dependencies && packageJson.dependencies['@nrwl/workspace']
    ? packageJson.dependencies['@nrwl/workspace']
    : null;
}

function getCurrentPackageVersion() {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
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

// Get the NX version from package.json
const nxVersion = getNxVersion();

if (!nxVersion) {
  console.error('NX version not found in package.json.');
  process.exit(1);
}

const packageVersion = getCurrentPackageVersion();

if (!packageVersion) {
  console.error('Package version not found in package.json.');
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

    // Install dependencies
    await execCommand('pnpm', [
      'install',
      `@brainly-gene/core@${packageVersion}`,
      `@brainly-gene/next@${packageVersion}`,
      `next@12.3.4`,
      `ramda@0.30.1`,
      `react@18.3.1`,
      `react-dom@18.3.1`,
      'brainly-style-guide',
      `inversify@5.1.1`,
      `@tanstack/react-query@5.55.4`,
      '@nrwl/next@15.8.6',
      'style-loader@2.0.0',
      'css-loader@3.6.0',
      'sass@1.55.0',
      'sass-loader@9.0.2',
      'classnames@2.5.1',
    ]);

    // Install dev dependencies
    await execCommand('pnpm', [
      'install',
      '-D',
      `@brainly-gene/tools@${packageVersion}`,
      `@brainly-gene/eslint-plugin@${packageVersion}`,
      `eslint@8.44.0`,
      `@types/react@18.3.12`,
      `@types/ramda@0.30.2`,
      `@types/node@18.19.55`,
      'eslint-plugin-cypress@2.10.3',
      '@nrwl/eslint-plugin-nx@15.8.9',
      'eslint-plugin-react-hooks@4.6.0',
      'eslint-plugin-jsx-a11y@6.6.1',
      'eslint-plugin-react@7.31.11',
      'eslint-config-next@13.1.1',
      '@nrwl/jest@15.8.9',
      'msw@0.49.2',
      'msw-storybook-addon@1.6.3',
      '@storybook/addon-actions@6.5.16',
      '@storybook/core-server@6.5.16',
      '@storybook/addon-backgrounds@6.3.8',
      '@storybook/addon-knobs@6.3.1',
      '@storybook/addon-links@6.3.8',
      '@storybook/addon-storysource@6.3.8',
      '@storybook/addon-viewport@6.3.8',
      '@storybook/addons@6.3.8',
      '@storybook/builder-webpack5@6.5.16',
      '@storybook/manager-webpack5@6.5.16',
      '@storybook/react@6.5.16',
      '@storybook/theming@6.5.16',
      '@testing-library/dom@8.20.1',
      '@testing-library/jest-dom@5.14.1',
      '@testing-library/react@16.0.0',
      '@nrwl/cypress@15.8.9',
      '@nrwl/react@15.8.9',
      '@nrwl/web@15.8.9',
    ]);

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

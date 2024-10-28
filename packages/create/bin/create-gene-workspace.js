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

    await execCommand('pnpm', [
      'install',
      `@brainly-gene/core@${packageVersion}`,
      `@brainly-gene/next@${packageVersion}`,
      `@brainly-gene/apollo@${packageVersion}`,
      'brainly-style-guide',
    ]);

    // Install dev dependencies
    await execCommand('pnpm', [
      'install',
      `@brainly-gene/tools@${packageVersion}`,
      `@brainly-gene/eslint-plugin@${packageVersion}`,
      '-D',
    ]);

    console.log('Generating gene-workspace with pnpm nx');
    await execCommand('pnpm', [
      'nx',
      'g',
      '@brainly-gene/tools:gene-workspace',
    ]);
  } catch (error) {
    console.error(error);
  }
}

// Run the commands
runCommands();

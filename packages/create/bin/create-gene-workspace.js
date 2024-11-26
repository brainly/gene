#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to load dependencies and devDependencies from versions.json
function loadVersions() {
  const versionsFilePath = path.resolve(__dirname, 'versions.json');
  if (!fs.existsSync(versionsFilePath)) {
    console.error('versions.json file not found.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(versionsFilePath, 'utf8'));
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

// Load versions.json
const { dependencies, devDependencies } = loadVersions();

if (!devDependencies['@nx/workspace']) {
  console.error('NX version not found in versions.json.');
  process.exit(1);
}

const nxVersion = devDependencies['@nx/workspace'];

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
      '--nxCloud=skip',
    ]);

    console.log(
      `Workspace ${name} created successfully with NX version ${nxVersion}!`
    );

    console.log(`Changing directory to ${name}`);
    process.chdir(name);

    console.log('Installing dependencies with npm');

    // Install dependencies
    const dependencyArgs = Object.entries(dependencies).map(
      ([pkg, version]) => `${pkg}@${version}`
    );
    await execCommand('npm', [
      'install',
      ...dependencyArgs,
      '--legacy-peer-deps',
    ]);

    // Install devDependencies
    console.log('Installing dev dependencies with npm');
    const devDependencyArgs = Object.entries(devDependencies).map(
      ([pkg, version]) => `${pkg}@${version}`
    );
    await execCommand('npm', [
      'install',
      '-D',
      ...devDependencyArgs,
      '--legacy-peer-deps',
    ]);

    // We should be able to remove `--legacy-peer-deps` once storybook is updated to v7

    console.log('Generating gene-workspace with nx');
    await execCommand('nx', ['g', '@brainly-gene/tools:gene-workspace']);

    console.log('Generating e2e testing providers');
    await execCommand('nx', ['g', '@brainly-gene/tools:e2e-providers']);
  } catch (error) {
    console.error(error);
  }
}

// Run the commands
runCommands();

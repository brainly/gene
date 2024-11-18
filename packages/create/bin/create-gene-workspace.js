#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to read dependencies and devDependencies from versions.json
function getPackageVersion(packageName) {
  const versionsJsonPath = path.resolve(__dirname, 'versions.json');
  const versionsJson = JSON.parse(fs.readFileSync(versionsJsonPath, 'utf8'));

  const dependencies = versionsJson.dependencies || {};
  const devDependencies = versionsJson.devDependencies || {};

  return dependencies[packageName] || devDependencies[packageName] || 'latest';
}

// Function to load the dependencies list from the external file
function loadDependencies() {
  const dependenciesFilePath = path.resolve(__dirname, 'dependencies.json');
  if (!fs.existsSync(dependenciesFilePath)) {
    console.error('dependencies.json file not found.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(dependenciesFilePath, 'utf8'));
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
    // Load dependencies and devDependencies from the external file
    const { dependencies, devDependencies } = loadDependencies();

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
    const dependencyArgs = dependencies.map(
      (pkg) => `${pkg}@${getPackageVersion(pkg)}`
    );
    await execCommand('pnpm', ['install', ...dependencyArgs]);

    // Install devDependencies
    console.log('Installing dev dependencies with pnpm');
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

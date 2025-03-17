const { execSync } = require('child_process');
const { detectPackageManager } = require('@nx/devkit');
const { existsSync } = require('fs');
const { toAbsolute } = require('../utilities/path');
const { copySync, removeSync, ensureDirSync } = require('fs-extra');
const { resolve, join, basename, dirname } = require('path');

const assetsPaths = {
  'brainly-style-guide/css': 'node_modules/brainly-style-guide/css/.',
  'brainly-style-guide/css/fonts':
    'node_modules/brainly-style-guide/src/fonts/.',
  'brainly-style-guide/images': 'node_modules/brainly-style-guide/src/images/.',
  'nx-images': 'libs/assets/src/nx-images/.',
  'nx-static': 'libs/assets/src/nx-static/.',
  'nx-fonts': 'libs/assets/src/nx-fonts/.',
};

function prepareStorybookRootAssets(workspaceRoot) {
  console.log('Preparing storybook root assets...');

  console.log('Check if .storybook directory exists');
  if (!existsSync(resolve(workspaceRoot, '.storybook/main.js'))) {
    console.log(
      'No .storybook directory found. Running nx g @brainly-gene/tools:storybook-init',
    );

    const packageManager = detectPackageManager();
    execSync(`${packageManager} nx g @brainly-gene/tools:storybook-init`);

    execSync(`${packageManager} msw init .storybook/msw --save=true`);
  }

  copySync(
    join(workspaceRoot, '.storybook/msw/mockServiceWorker.js'),
    join(workspaceRoot, '.storybook/assets/mockServiceWorker.js'),
    { overwrite: true },
  );

  Object.keys(assetsPaths).forEach((key) => {
    //Check if assetsPath exists
    const absolutePathFrom = toAbsolute(assetsPaths[key]);
    if (existsSync(absolutePathFrom)) {
      const absolutePathTo = join(workspaceRoot, '.storybook/assets/', key);

      removeSync(absolutePathTo, { recursive: true });
      ensureDirSync(dirname(absolutePathTo));
      copySync(absolutePathFrom, absolutePathTo, { recursive: true });
    } else {
      console.log(`Path ${absolutePathFrom} does not exist. Continuing...`);
    }
  });

  console.log('Assets prepared!');
}

module.exports = { prepareStorybookRootAssets };

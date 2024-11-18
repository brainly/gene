const fs = require('fs');
const path = require('path');

// Paths to the files
const dependenciesPath = path.resolve(__dirname, 'dependencies.json');
const rootPackagePath = path.resolve(__dirname, '../../../package.json');
const outputPath = path.resolve(__dirname, 'versions.json');

// Read the dependencies.json file
let dependenciesData;
try {
  dependenciesData = JSON.parse(fs.readFileSync(dependenciesPath, 'utf8'));
} catch (err) {
  console.error('Error reading dependencies.json:', err);
  process.exit(1);
}

// Read the root package.json file
let rootPackageData;
try {
  rootPackageData = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
} catch (err) {
  console.error('Error reading root package.json:', err);
  process.exit(1);
}

// Extract versions for each dependency and devDependency
const getVersions = (packages, source) => {
  const versions = {};
  packages.forEach((pkg) => {
    if (source.dependencies && source.dependencies[pkg]) {
      versions[pkg] = source.dependencies[pkg];
      return versions;
    }

    if (source.devDependencies && source.devDependencies[pkg]) {
      versions[pkg] = source.devDependencies[pkg];
      return versions;
    }

    if (pkg.startsWith('@brainly-gene/')) {
      versions[pkg] = rootPackageData.version;
      return versions;
    }

    console.warn(`Version for package "${pkg}" not found.`);
    versions[pkg] = null;

    return versions;
  });
  return versions;
};

const allVersions = {
  dependencies: getVersions(
    dependenciesData.dependencies || [],
    rootPackageData
  ),
  devDependencies: getVersions(
    dependenciesData.devDependencies || [],
    rootPackageData
  ),
};

// Write the versions.json file
try {
  fs.writeFileSync(outputPath, JSON.stringify(allVersions, null, 2), 'utf8');
  console.log('versions.json has been created successfully.');
} catch (err) {
  console.error('Error writing versions.json:', err);
  process.exit(1);
}

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
  const removedPackages = [];

  packages.forEach((pkg) => {
    if (source.dependencies && source.dependencies[pkg]) {
      versions[pkg] = source.dependencies[pkg];
    } else if (source.devDependencies && source.devDependencies[pkg]) {
      versions[pkg] = source.devDependencies[pkg];
    } else if (pkg.startsWith('@brainly-gene/')) {
      versions[pkg] = rootPackageData.version;
    } else {
      removedPackages.push(pkg);
    }
  });

  return { versions, removedPackages };
};

const { versions: dependencyVersions, removedPackages: removedDependencies } =
  getVersions(dependenciesData.dependencies || [], rootPackageData);

const {
  versions: devDependencyVersions,
  removedPackages: removedDevDependencies,
} = getVersions(dependenciesData.devDependencies || [], rootPackageData);

// Update dependencies.json by removing packages not found in package.json
if (removedDependencies.length > 0 || removedDevDependencies.length > 0) {
  dependenciesData.dependencies = dependenciesData.dependencies.filter(
    (pkg) => !removedDependencies.includes(pkg)
  );
  dependenciesData.devDependencies = dependenciesData.devDependencies.filter(
    (pkg) => !removedDevDependencies.includes(pkg)
  );

  // Write updated dependencies.json
  try {
    fs.writeFileSync(
      dependenciesPath,
      JSON.stringify(dependenciesData, null, 2),
      'utf8'
    );
    console.log('dependencies.json has been updated by removing:', [
      ...removedDependencies,
      ...removedDevDependencies,
    ]);
  } catch (err) {
    console.error('Error updating dependencies.json:', err);
    process.exit(1);
  }
}

// Write the versions.json file
const allVersions = {
  dependencies: dependencyVersions,
  devDependencies: devDependencyVersions,
};

try {
  fs.writeFileSync(outputPath, JSON.stringify(allVersions, null, 2), 'utf8');
  console.log('versions.json has been created successfully.');
} catch (err) {
  console.error('Error writing versions.json:', err);
  process.exit(1);
}

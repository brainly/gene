const fs = require('fs');

function tsPathToWebpackAliases(tsConfigPath, rootDir) {
  const rawConfig = fs.readFileSync(tsConfigPath).toString();
  const tsConfig = JSON.parse(rawConfig);

  const { paths } = tsConfig.compilerOptions;
  return Object.keys(paths).reduce((acc, key) => {
    const path = paths[key][0];
    if (path.startsWith('libs')) {
      acc[key] = `${rootDir}/${path}`;
    }
    return acc;
  }, {});
}

module.exports = {
  tsPathToWebpackAliases,
};

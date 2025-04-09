const {readWorkspaceConfig} = require('@nx/workspace');
const fs = require('fs');

function getWorkspaceLibConfigByPath(path) {
  const {projects} = readWorkspaceConfig({format: 'nx'});

  return Object.values(projects).find(project => {
    return path.startsWith(project.sourceRoot);
  });
}

module.exports = {getWorkspaceLibConfigByPath};

const {
  isWorkspaceProject,
  readCachedProjectGraph,
} = require('@nrwl/workspace/src/core/project-graph');
const {execSync} = require('child_process');

/**
 * Gets a list of projects affected by changes.
 * @param {string} [baseCommitHash] Base commit hash used to compare against.
 * @returns {string[]} Array of project names that are affected by changes.
 */
function getAffectedProjects(baseCommitHash) {
  const nx = require.resolve('@nrwl/cli');
  const command = `${nx} print-affected --select=projects${
    baseCommitHash ? ' --base=' + baseCommitHash : ''
  }`;

  const affectedProjectsOutput = execSync(command, {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  const projectGraph = readCachedProjectGraph();

  const affectedProjects = affectedProjectsOutput
    .split(',')
    .map(project => project.trim())
    .filter(Boolean)
    .filter(project => isWorkspaceProject(projectGraph.nodes[project]));

  return affectedProjects;
}

module.exports = {getAffectedProjects};

const { workspaceRoot } = require('@nrwl/devkit');
const { resolve } = require('path');

/**
 * Converts a path relative to the workspace root to an absolute path.
 * @param {string} path The path relative to the workspace root.
 * @returns Absolute path.
 */
function toAbsolute(path) {
  return resolve(workspaceRoot, path);
}

module.exports = { toAbsolute };

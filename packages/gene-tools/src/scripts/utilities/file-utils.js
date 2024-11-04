const {readdirSync, rmSync, statSync} = require('fs');
const {join} = require('path');
const {toAbsolute} = require('./path');

/**
 * Visits all files in a directory and executes a callback on each file.
 * @param {string} dirPath The directory path.
 * @param {(path: string) => void} visitor The visitor function that gets called for each file.
 */
function visitFiles(dirPath, visitor) {
  readdirSync(toAbsolute(dirPath)).forEach(child => {
    const childPath = join(dirPath, child);
    const stats = statSync(childPath);

    if (!stats.isDirectory()) {
      visitor(childPath);
    } else {
      visitFiles(childPath, visitor);
    }
  });
}

/**
 * Removes files and directories.
 * @param {string} path The path to remove.
 * @param {boolean} throwOnError Whether to rethrow errors.
 */
function removePath(path, throwOnError = true) {
  try {
    rmSync(path, {force: true, recursive: true});
  } catch (e) {
    if (throwOnError) {
      throw e;
    }
  }
}

/**
 * Removes files and directories when the process exits.
 * @param {string} path The path to remove.
 */
function removePathOnExitProcess(path) {
  process.on('exit', () => removePath(path, false));
  process.on('SIGINT', () => removePath(path, false));
}

module.exports = {removePath, removePathOnExitProcess, visitFiles};

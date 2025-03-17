const fs = require('fs');

const { getColumns } = require('./columnMapper');
const { getComponentMetadata } = require('../common/utils/meta');
const {
  extractReactComponents,
} = require('../common/utils/extractReactComponents');

function isNotApplicable(column, { isPrivate, truncatedPath }) {
  if (!isPrivate) {
    return false;
  }

  if (column.skipForPrivateComponents === true) {
    return true;
  }

  if (typeof column.skipForPrivateComponents === 'function') {
    return column.skipForPrivateComponents({ truncatedPath });
  }

  return false;
}

function generateComponentReport({ files, pathPrefix, jestOutput, prUrl }) {
  const truncatedPaths = extractReactComponents({ files });

  const columns = getColumns({ jestOutput });

  const errors = [];
  let errorsDetected = false;

  const rows = truncatedPaths.map((truncatedPath) => {
    try {
      const { isPrivate, componentName, componentDisplayName } =
        getComponentMetadata(
          fs.readFileSync(`${truncatedPath}.tsx`).toString(),
        );

      return columns
        .map((c) => {
          if (isNotApplicable(c, { isPrivate, truncatedPath })) {
            return 'N/A';
          }

          try {
            const { content, success } = c.run({
              truncatedPath,
              isPrivate,
              componentName,
              componentDisplayName,
              prUrl,
            });

            if (!success) {
              errorsDetected = true;
            }

            return content;
          } catch (e) {
            errorsDetected = true;
            return `Error getting cell content: ${e.message}`;
          }
        })
        .join(' | ');
    } catch (e) {
      errorsDetected = true;
      errors.push(`Could not process ${truncatedPath}.tsx: ${e.message}`);
      return null;
    }
  });

  if (truncatedPaths.length === 0) {
    return {
      report: null,
      success: true,
    };
  }

  const table = [
    columns.map((c) => c.name).join(' | '),
    columns.map(() => '---').join(' | '),
    ...rows.filter(Boolean),
  ].join('\n');

  const maybeErrors =
    errors.length > 0
      ? ['', '## Errors', ...errors.map((e) => `* ${e}`)].join('\n')
      : null;

  return {
    report: [`## Components report for ${pathPrefix}`, table, maybeErrors]
      .filter(Boolean)
      .join('\n'),
    success: !errorsDetected,
  };
}

module.exports = { generateComponentReport };

const {
  validateModuleDeclaration,
} = require('./validators/moduleDeclarationValidator');
const { generateLink } = require('../common/utils/generatePrLink');
const { SUCCESS_ICON, getIcon } = require('../common/constants/reportsIcons');
const { validateExports } = require('./validators/exportsValidator');
const { validateDelegates } = require('./validators/delegatesValidator');
const { getModuleStoriesMeta } = require('./validators/storiesValidator');

function maybeWrapInLink(name, link) {
  if (!link) {
    return name;
  }

  return `[${name}](${link})`;
}

function aggregateResults(results) {
  return results.reduce(
    (acc, item) => {
      if (!item.valid) {
        acc.success = false;
      }

      acc.content += item.content;

      return acc;
    },
    {
      success: true,
      content: '',
    },
  );
}

function formatDeclarationResponse({ valid, variant, error, isLast, type }) {
  const message = valid
    ? SUCCESS_ICON
    : `${getIcon(
        type,
      )} ${error} <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a>`;

  return {
    valid,
    content: `**${variant}**: ${message}${!isLast ? '<hr>' : ''}`,
  };
}

function formatExportResponse({
  valid,
  link,
  displayFilePath,
  error,
  isLast,
  type,
}) {
  const message = valid
    ? SUCCESS_ICON
    : `${getIcon(
        type,
      )} ${error} <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a>`;

  return {
    valid,
    content: `[${displayFilePath}](${link}): ${message}${!isLast ? '<hr>' : ''}`,
  };
}

function formatDelegateResponse({
  valid,
  link,
  displayFilePath,
  error,
  isLast,
  type,
}) {
  const message = valid
    ? SUCCESS_ICON
    : `${getIcon(
        type,
      )} ${error} <br> <a href="https://brainly.github.io/gene/gene/modules/pr-checker" target="_blank">See docs to learn how to fix it</a>`;

  return {
    valid,
    content: `[${displayFilePath}](${link}): ${message}${!isLast ? '<hr>' : ''}`,
  };
}

/*
  To add a new column to the report just add a entry here.
  You need to specify column header and a validator function
*/
function getColumns() {
  return [
    {
      name: 'Name',
      run: ({ moduleName, moduleFiles, prUrl }) => {
        const [, files] = moduleFiles[0];

        const link = generateLink({
          truncatedPath: files.module,
          prUrl,
        });

        return {
          content: maybeWrapInLink(moduleName, link),
          success: true,
        };
      },
    },
    {
      name: 'Module declaration',
      run: ({ moduleFiles, isCore, checkerConfig }) => {
        return aggregateResults(
          moduleFiles.map(([variantName, variantFiles], index) => {
            const { module: mainModuleFile } = variantFiles;

            const { valid, error, type } = validateModuleDeclaration({
              file: mainModuleFile,
              isCore,
              checkerConfig,
            });

            const isLast = index === moduleFiles.length - 1;

            return formatDeclarationResponse({
              valid,
              variant: variantName,
              error,
              isLast,
              type,
            });
          }),
        );
      },
    },
    {
      name: 'Custom hooks (a.k.a delegates)',
      run: ({
        delegates,
        pathPrefix,
        checkerConfig,
        moduleFiles,
        isCore,
        prUrl,
      }) => {
        const delegatesExcludingTests = delegates.filter(
          (filePath) =>
            !filePath.includes('.test.') && !filePath.includes('.spec.'),
        );

        const results = delegatesExcludingTests.map((filePath, index) => {
          const isLast = index === delegates.length - 1;

          const { valid, error, type } = validateDelegates({
            filePath,
            checkerConfig,
            moduleFiles,
            isCore,
            allDelegatesFiles: delegates,
          });

          return {
            valid,
            error,
            type,
            isLast,
            filePath,
          };
        });

        if (results.some(({ valid }) => !valid)) {
          return aggregateResults(
            results.map(({ valid, error, filePath, isLast, type }) => {
              const displayFilePath = filePath.replace(pathPrefix, '');

              const link = generateLink({
                truncatedPath: filePath,
                prUrl,
              });

              return formatDelegateResponse({
                valid,
                link,
                displayFilePath,
                error,
                isLast,
                type,
              });
            }),
          );
        }

        return { content: SUCCESS_ICON, success: true };
      },
    },
    {
      name: 'Exports',
      run: ({ exports, isCore, pathPrefix, checkerConfig, prUrl }) => {
        const results = validateExports({
          filePaths: exports,
          isCore,
          pathPrefix,
          checkerConfig,
        });

        if (results.some(({ valid }) => !valid)) {
          return aggregateResults(
            results.map(({ valid, error, filePath, type }, index) => {
              const isLast = index === exports.length - 1;
              const displayFilePath = filePath.replace(pathPrefix, '');

              const link = generateLink({
                truncatedPath: filePath,
                prUrl,
              });

              return formatExportResponse({
                valid,
                link,
                displayFilePath,
                error,
                type,
                isLast,
              });
            }),
          );
        }

        return { content: SUCCESS_ICON, success: true };
      },
    },
    {
      name: 'Stories',
      run: ({ moduleFiles, checkerConfig }) => {
        const { storybook_required: storybookRequired } =
          checkerConfig?.rules || {};

        if (!storybookRequired || storybookRequired?.enabled === false) {
          return {
            content: SUCCESS_ICON,
            success: true,
          };
        }

        const results = moduleFiles.map(([variantName, files]) => {
          const storybookFile = files.stories;

          if (!storybookFile) {
            return {
              valid: false,
              error: `Storybook file does not exists`,
              variantName,
            };
          }

          const modulesAndStoriesPairs = getModuleStoriesMeta({
            storybookFile,
          });

          if (
            modulesAndStoriesPairs.find(
              ([moduleName]) => moduleName === variantName,
            )
          ) {
            return { valid: true };
          }

          return {
            valid: false,
            error: `Module is not present in storybook`,
            variantName,
          };
        });

        if (results.some(({ valid }) => !valid)) {
          return aggregateResults(
            results
              .filter(({ valid }) => !valid)
              .map(({ valid, error, variantName }) => {
                return {
                  valid,
                  content: `**${variantName}**: ${error} <br>`,
                };
              }),
          );
        }

        return { content: SUCCESS_ICON, success: true };
      },
    },
  ];
}

module.exports = { getColumns };

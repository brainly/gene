const fs = require('fs');

const { validateProps } = require('./validators/propsValidator');
const { extractTestCoverage } = require('./validators/testCoverage');
const { validateStories } = require('./validators/storiesValidator');
const {
  validateMemoization,
} = require('../common/validators/memoizeValidator');
const { validateTests } = require('./validators/testsValidator/testsValidator');
const { validateEvents } = require('./validators/eventsValidator');
const { validateScss } = require('./validators/scssValidator');

const { generateLink } = require('../common/utils/generatePrLink');
const {
  SUCCESS_ICON,
  ERROR_ICON,
  getIcon,
} = require('../common/constants/reportsIcons');

function maybeWrapInLink(name, link) {
  if (!link) {
    return name;
  }

  return `[${name}](${link})`;
}

/*
  To add a new column to the report just add a entry here.
  You need to specify column header and a validator function
*/
function getColumns({ jestOutput }) {
  return [
    {
      name: 'Name',
      run: ({ isPrivate, componentDisplayName, truncatedPath, prUrl }) => {
        const link = generateLink({ truncatedPath, prUrl });

        if (isPrivate) {
          return {
            content: maybeWrapInLink(`${componentDisplayName} *private*`, link),
            success: true,
          };
        }

        return {
          content: maybeWrapInLink(componentDisplayName, link),
          success: true,
        };
      },
    },
    {
      name: 'Specs',
      run: ({ truncatedPath }) => {
        const {
          valid,
          error,
          type = 'error',
        } = validateTests({ truncatedPath });

        if (!valid && !error) {
          return { content: ERROR_ICON, success: false };
        }

        return valid
          ? { content: SUCCESS_ICON, success: true }
          : { content: `${getIcon(type)} ${error}`, success: type !== 'error' };
      },
      skipForPrivateComponents: ({ truncatedPath }) =>
        !fs.existsSync(`${truncatedPath}.spec.tsx`),
    },
    {
      name: 'Stories',
      run: ({ truncatedPath }) => {
        const storiesExists = fs.existsSync(`${truncatedPath}.stories.tsx`);

        if (!storiesExists) {
          return { content: ERROR_ICON, success: false };
        }

        const {
          error,
          valid,
          type = 'error',
        } = validateStories({ truncatedPath });

        return valid
          ? { content: SUCCESS_ICON, success: true }
          : { content: `${getIcon(type)} ${error}`, success: type !== 'error' };
      },
      skipForPrivateComponents: true,
    },
    {
      name: 'SCSS',
      run: ({ truncatedPath }) => {
        const { valid } = validateScss({ truncatedPath });

        return valid
          ? { content: SUCCESS_ICON, success: true }
          : { content: ERROR_ICON, success: false };
      },
      skipForPrivateComponents: true,
    },
    {
      name: 'Test coverage',
      run: ({ truncatedPath }) => {
        const testCoverage = extractTestCoverage({ truncatedPath, jestOutput });

        // This is an edge case that happens if a test files changes
        // but the component itself does not. It should not cause the report to fail.
        if (testCoverage === 'missing') {
          return {
            content: 'missing',
            success: true,
          };
        }

        const icon = testCoverage === '100%' ? SUCCESS_ICON : ERROR_ICON;

        return {
          content: `${icon} ${testCoverage}`,
          success: testCoverage === '100%',
        };
      },
    },
    {
      name: 'Props',
      run: ({ truncatedPath }) => {
        const {
          valid,
          error,
          type = 'error',
        } = validateProps(`${truncatedPath}.tsx`);

        return valid
          ? { content: SUCCESS_ICON, success: true }
          : { content: `${getIcon(type)} ${error}`, success: type !== 'error' };
      },
    },
    {
      name: 'Memo',
      run: ({ truncatedPath }) => {
        const {
          valid,
          error,
          type = 'error',
        } = validateMemoization(`${truncatedPath}.tsx`);

        return valid
          ? { content: SUCCESS_ICON, success: true }
          : { content: `${getIcon(type)} ${error}`, success: type !== 'error' };
      },
    },
    {
      name: 'Events',
      run: ({ truncatedPath }) => {
        const { valid, error } = validateEvents(`${truncatedPath}.tsx`);

        return valid
          ? { content: SUCCESS_ICON, success: true }
          : { content: error, success: false };
      },
    },
  ];
}

module.exports = { getColumns };

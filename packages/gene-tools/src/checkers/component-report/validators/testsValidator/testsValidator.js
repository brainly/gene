const fs = require('fs');
const { getMissingListsCoverage } = require('./listsValidator');
const { getUnnecessaryMocks } = require('./mocksValidator');

const validators = [
  { fn: getMissingListsCoverage, experimental: true },
  { fn: getUnnecessaryMocks },
];

const validateTests = ({ truncatedPath }) => {
  try {
    const areTestsIncluded = fs.existsSync(`${truncatedPath}.spec.tsx`);

    if (!areTestsIncluded) {
      return {
        valid: false,
      };
    }

    const testsSrc = fs.readFileSync(`${truncatedPath}.spec.tsx`).toString();

    if (!testsSrc) {
      return {
        valid: false,
      };
    }

    const cmpSrc = fs.readFileSync(`${truncatedPath}.tsx`).toString();

    const allErrors = validators
      .map(({ fn, experimental }) => {
        return {
          errorMessage: fn({ testsSrc, cmpSrc }),
          experimental: experimental,
        };
      })
      .filter((item) => item.errorMessage);

    const isExperimentalType = allErrors.every(
      ({ experimental }) => experimental,
    );

    if (allErrors.length > 0) {
      return {
        valid: false,
        error: allErrors.map((e) => e.errorMessage).join(', '),
        ...(isExperimentalType ? { type: 'experimental' } : {}),
      };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: `Validation error: ${e.message}` };
  }
};

module.exports = { validateTests };

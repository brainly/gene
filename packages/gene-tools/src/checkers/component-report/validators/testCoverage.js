function extractTestCoverage({truncatedPath, jestOutput}) {
  const parts = truncatedPath.split('/');
  const componentName = `${parts[parts.length - 1]}\\.tsx`;

  // branch coverage is in the third column
  const branchCoverageRegexp = new RegExp(
    `^\\s*${componentName}\\s*\\|.*?\\|\\s*(\\d+)`,
    'gm'
  );

  const branchCoverageMatch = [...jestOutput.matchAll(branchCoverageRegexp)];

  if (branchCoverageMatch.length === 0) {
    return 'missing';
  }

  if (branchCoverageMatch.length > 1) {
    return 'duplicated name';
  }

  return `${branchCoverageMatch[0][1]}%`;
}

module.exports = {extractTestCoverage};

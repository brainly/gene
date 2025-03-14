const crypto = require('crypto');

function generateLink({ truncatedPath, prUrl }) {
  // PR url is not available in preview mode
  if (!prUrl) {
    return null;
  }

  const path = truncatedPath.includes('.ts')
    ? truncatedPath
    : `${truncatedPath}.tsx`;

  const hash = crypto.createHash('sha256').update(path).digest('hex');

  return `${prUrl}/files#diff-${hash}`;
}

module.exports = { generateLink };

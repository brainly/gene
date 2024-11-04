const { generateLink } = require('./generatePrLink');
const crypto = require('crypto');

describe('generateLink', () => {
  it('should return null if prUrl is not provided', () => {
    const result = generateLink({
      truncatedPath: 'libs/components/Button',
      prUrl: null,
    });
    expect(result).toBeNull();
  });

  it('should append .tsx to the path if not already present', () => {
    const truncatedPath = 'libs/components/Button';
    const prUrl =
      'https://github.com/example-organization/example-repository/pull/123';
    const expectedPath = `${truncatedPath}.tsx`;
    const hash = crypto.createHash('sha256').update(expectedPath).digest('hex');
    const expectedLink = `${prUrl}/files#diff-${hash}`;

    const result = generateLink({ truncatedPath, prUrl });
    expect(result).toEqual(expectedLink);
  });

  it('should not append .tsx to the path if already present .ts', () => {
    const regularPath = 'libs/example-lib/src/lib/example-module/index.ts';
    const prUrl =
      'https://github.com/example-organization/example-repository/pull/123';
    const hash = crypto.createHash('sha256').update(regularPath).digest('hex');
    const expectedLink = `${prUrl}/files#diff-${hash}`;

    const result = generateLink({ truncatedPath: regularPath, prUrl });
    expect(result).toEqual(expectedLink);
  });

  it('should not append .tsx to the path if already present .tsx', () => {
    const regularPath =
      'libs/example-lib/src/lib/example-module/ExampleModule.tsx';
    const prUrl =
      'https://github.com/example-organization/example-repository/pull/123';
    const hash = crypto
      .createHash('sha256')
      .update(regularPath)
      .digest('hex');
    const expectedLink = `${prUrl}/files#diff-${hash}`;

    const result = generateLink({ truncatedPath: regularPath, prUrl });
    expect(result).toEqual(expectedLink);
  });
});

const path = require('path');

const {extractTestCoverage} = require('./testCoverage');

describe('extractTestCoverage()', () => {
  it('works with a single component', () => {
    const jestOutput = `
    SomeComponent.tsx    |       0 |        0 |       0 |       0 |
    ValidProps.tsx      |       10 |       20 |      30 |      40 |`;

    expect(
      extractTestCoverage({
        truncatedPath: path.resolve(__dirname, '../mocks/ValidProps'),
        jestOutput,
      })
    ).toEqual('20%');
  });

  it('detects duplicate component name', () => {
    const jestOutput = `
    SomeComponent.tsx    |       0 |        0 |       0 |       0 |
    ValidProps.tsx      |       11 |       21 |      31 |      41 |
    ValidProps.tsx      |       10 |       20 |      30 |      40 |`;

    expect(
      extractTestCoverage({
        truncatedPath: path.resolve(__dirname, '../mocks/ValidProps'),
        jestOutput,
      })
    ).toEqual('duplicated name');
  });
});

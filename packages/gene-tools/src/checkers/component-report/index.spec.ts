import { generateComponentReport } from './index';
import path from 'path';

const pathPrefix = path.resolve(__dirname, 'mocks');

describe('generateComponentReport()', () => {
  it('generates a complete report', () => {
    const jestOutput = `
    SomeComponent.tsx    |       0 |        0 |       0 |       0 |
    ValidProps.tsx      |       10 |       20 |      30 |      40 |`;

    const { report } = generateComponentReport({
      files: [path.resolve(__dirname, 'mocks/components/ValidProps.tsx')],
      pathPrefix,
      jestOutput,
    });

    const expectedResult = `## Components report for ${pathPrefix}
Name | Specs | Stories | SCSS | Test coverage | Props | Memo | Events
--- | --- | --- | --- | --- | --- | --- | ---
compose(React.memo)(ValidProps) | :red_circle: | :red_circle: | :white_check_mark: | :red_circle: 20% | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    expect(report).toEqual(expectedResult);
  });

  it('renders error as string', () => {
    const { report } = generateComponentReport({
      files: [path.resolve(__dirname, 'mocks/components/CallbackProp.tsx')],
      pathPrefix,
      jestOutput: '',
    });

    const expectedResult = `## Components report for ${pathPrefix}
Name | Specs | Stories | SCSS | Test coverage | Props | Memo | Events
--- | --- | --- | --- | --- | --- | --- | ---
compose(React.memo)(CallbackProp) | :red_circle: | :red_circle: | :white_check_mark: | missing | :red_circle: A component should not accept a callback prop: onClick | :white_check_mark: | :white_check_mark:`;

    expect(report).toEqual(expectedResult);
  });

  it('handles no components provided', () => {
    const { report } = generateComponentReport({
      files: [path.resolve(__dirname, 'mocks/components/someUtil.ts')],
      pathPrefix,
    });

    const expectedResult = null;

    expect(report).toEqual(expectedResult);
  });

  it('handles errors', () => {
    const { report } = generateComponentReport({
      files: [path.resolve(__dirname, 'mocks/components/SomeType.tsx')],
      pathPrefix,
    });

    const expectedResult = `## Components report for ${pathPrefix}
Name | Specs | Stories | SCSS | Test coverage | Props | Memo | Events
--- | --- | --- | --- | --- | --- | --- | ---

## Errors
* Could not process ${path.resolve(
      __dirname,
      'mocks/components/SomeType.tsx',
    )}: No default export found`;

    expect(report).toEqual(expectedResult);
  });

  it('handles private components that dont have tests', () => {
    const { report } = generateComponentReport({
      files: [
        path.resolve(__dirname, 'mocks/components/CallbackPropPrivate.tsx'),
      ],
      pathPrefix,
      jestOutput: '',
    });

    const expectedResult = `## Components report for ${pathPrefix}
Name | Specs | Stories | SCSS | Test coverage | Props | Memo | Events
--- | --- | --- | --- | --- | --- | --- | ---
compose(React.memo)(CallbackProp) *private* | N/A | N/A | N/A | missing | :white_check_mark: | :white_check_mark: | :white_check_mark:`;

    expect(report).toEqual(expectedResult);
  });
});

const {
  getDeclaredProps,
  getExpressionsInView,
  getPositivePropsFromStories,
  getMessagesFromConditionalProps,
} = require('./storiesValidatorConditionalRender');
const path = require('path');

describe('getDeclaredLists()', () => {
  it('return lists of props', () => {
    const result = getDeclaredProps({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidConditionalRender',
      ),
    });

    expect(result).toEqual(['firstName', 'lastName', 'booleanExample']);
  });

  it('returns empty list where there is no props', () => {
    const result = getDeclaredProps({
      truncatedPath: path.resolve(__dirname, '../mocks/components/NoProps'),
    });

    expect(result).toEqual([]);
  });
});

describe('getExpressionsInView()', () => {
  it('returns expressions conditions list in JSX', () => {
    const result = getExpressionsInView({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidConditionalRender',
      ),
    });

    expect(result).toEqual(['firstName', 'someVal', 'lastName']);
  });

  it('returns empty list if there is no expressions', () => {
    const result = getExpressionsInView({
      truncatedPath: path.resolve(__dirname, '../mocks/components/NoProps'),
    });

    expect(result).toEqual([]);
  });
});

describe('getPositivePropsFromStories()', () => {
  it('returns declared props in stories', () => {
    const result = getPositivePropsFromStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidConditionalRender',
      ),
      declaredProps: ['firstName', 'lastName', 'booleanExample'],
    });

    expect(result).toEqual({
      firstName: { hasNegative: true, hasPositive: true },
      booleanExample: { hasNegative: true, hasPositive: true },
      lastName: { hasNegative: true, hasPositive: true },
    });
  });

  it('checks valid declared props without knobs', () => {
    const result = getPositivePropsFromStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/ValidConditionalRenderWithoutKnobs',
      ),
      declaredProps: ['variation'],
    });

    expect(result).toEqual({
      variation: { hasNegative: true, hasPositive: true },
    });
  });

  it('returns declared props in invalid stories', () => {
    const result = getPositivePropsFromStories({
      truncatedPath: path.resolve(
        __dirname,
        '../mocks/components/InvalidConditionalRender',
      ),
      declaredProps: ['firstName', 'lastName', 'booleanExample'],
    });

    expect(result).toEqual({
      firstName: { hasNegative: false, hasPositive: true },
      lastName: { hasNegative: true, hasPositive: false },
      booleanExample: { hasNegative: false, hasPositive: true },
    });
  });
});

describe('getMessagesFromConditionalProps()', () => {
  it('returns correct message based on props', () => {
    const exampleData = {
      firstName: { hasNegative: false, hasPositive: true },
      lastName: { hasNegative: true, hasPositive: false },
    };
    const correctMessage =
      'Some conditional props are not covered in stories: "firstName" doesn\'t have negative render. "lastName" doesn\'t have positive render. ';

    expect(getMessagesFromConditionalProps(exampleData)).toEqual(
      correctMessage,
    );
  });

  it('returns empty message when all props are correct', () => {
    const exampleData = {
      firstName: { hasNegative: true, hasPositive: true },
      lastName: { hasNegative: true, hasPositive: true },
    };

    expect(getMessagesFromConditionalProps(exampleData)).toEqual('');
  });
});

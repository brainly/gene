const { validateMemoization } = require('./memoizeValidator');
const path = require('path');

const defaultConfig = {
  rules: {
    memoization: true,
  },
};

describe('validateMemoization()', () => {
  it('is valid for a basic component', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingMemoizedFunc.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects non-memoized arrow function', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingArrowFunc.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      error: 'Passing non-memoized variable handler as onClick',
      valid: false,
    });
  });

  it('detects non-memoized objects', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingObject.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      error: 'Passing non-memoized variable object as data-obj',
      valid: false,
    });
  });

  it('allows non-memoized objects defined outside of a component', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingObjectFromOutside.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('always allows to pass selected props', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/AllowedProps.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects inline arrow function', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/InlineArrowFunc.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      error: 'Passing non-memoized inline arrow function as onClick',
      valid: false,
    });
  });

  it('detects inline objects', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/InlineObject.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      error: 'Passing non-memoized object as data-obj',
      valid: false,
    });
  });

  it('detects non-memoized function', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingFunc.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      error: 'Passing non-memoized function handler as onClick',
      valid: false,
    });
  });

  it('does not compain about passing non-memoized primitives', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingPrimitives.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('handles props forwarding', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PropsForwarding.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects non-memoized slots', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingSlot.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects non-memoized inline slots', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingInlineSlot.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('allows to pass memoized slots', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingMemoizedSlot.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('does not allow inline func calls', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingFuncCall.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: false,
      error: 'Passing non-memoized function call as id',
    });
  });

  it('allow to pass not memoized attributes to style-guide components', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingMemoizedAttributeToStyleGuideComponent.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('allow inline memoized func calls', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingMemoizedFuncCall.tsx'
      ),
      defaultConfig
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('skips validation when memoization is disabled', () => {
    const result = validateMemoization(
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/PassingArrowFunc.tsx'
      ),
      {
        rules: {
          memoization: false,
        },
      }
    );

    expect(result).toEqual({
      valid: true,
    });
  });
});

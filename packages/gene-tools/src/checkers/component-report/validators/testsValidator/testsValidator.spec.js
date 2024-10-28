const {validateTests} = require('./testsValidator');
const path = require('path');

describe('validateTests()', () => {
  it('is valid if lists are covered by number', () => {
    const result = validateTests({
      truncatedPath: path.resolve(
        __dirname,
        '../../mocks/components/PassingListSpecNumberCoverage'
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('is valid if lists are covered by variable', () => {
    const result = validateTests({
      truncatedPath: path.resolve(
        __dirname,
        '../../mocks/components/PassingListSpecVariableCoverage'
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('is valid if there are no lists to cover', () => {
    const result = validateTests({
      truncatedPath: path.resolve(
        __dirname,
        '../../mocks/components/NotApplyListSpecCoverage'
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects lack of spec file', () => {
    const result = validateTests({
      truncatedPath: path.resolve(
        __dirname,
        '../../mocks/components/NonExistingListSpecCoverage'
      ),
    });

    expect(result).toEqual({
      valid: false,
    });
  });

  it('detects uncovered list spec', () => {
    const result = validateTests({
      truncatedPath: path.resolve(
        __dirname,
        '../../mocks/components/MissingListSpecCoverage'
      ),
    });

    expect(result.valid).toBe(false);
    expect(result.type).toBe('experimental');

    expect(result.error).toContain('`cmps.map(...)`, `cmps.map(...)`');
    expect(result.error).toContain(
      'Some lists lengths assertions are missing, use both `.toHaveLength(0)` and `.toHaveLength(n)` for lists:'
    );
  });

  it('pass on no mocks', () => {
    const result = validateTests({
      truncatedPath: path.resolve(__dirname, '../../mocks/components/NoMocks'),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('pass on allowed mocks', () => {
    const result = validateTests({
      truncatedPath: path.resolve(
        __dirname,
        '../../mocks/components/AllowedMocks'
      ),
    });

    expect(result).toEqual({
      valid: true,
    });
  });

  it('fails on unnecessary mocks', () => {
    const result = validateTests({
      truncatedPath: path.resolve(
        __dirname,
        '../../mocks/components/NotAllowedMocks'
      ),
    });

    expect(result.valid).toBe(false);
    expect(result.type).not.toBe('experimental');
    expect(result.error).toContain('`@brainly-gene/core-xyz`');
    expect(result.error).toContain('There are unnecessary mocks on modules:');
  });
});

const { extractReactComponents } = require('./extractReactComponents');
const path = require('path');

describe('extractReactComponents()', () => {
  it('extracts truncated paths', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });

  it('dedups items', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.tsx',
          ),
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.spec.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });

  it('does not extract lower case files', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/someComponent.tsx',
          ),
        ],
      }),
    ).toEqual([]);
  });

  it('does not extract ts extensions', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.ts',
          ),
        ],
      }),
    ).toEqual([]);
  });

  it('handles stories', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.stories.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });

  it('handles specs', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.spec.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });
});
describe('extractReactComponents()', () => {
  it('extracts truncated paths', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });

  it('dedups items', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.tsx',
          ),
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.spec.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });

  it('does not extract lower case files', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/someComponent.tsx',
          ),
        ],
      }),
    ).toEqual([]);
  });

  it('does not extract ts extensions', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.ts',
          ),
        ],
      }),
    ).toEqual([]);
  });

  it('handles stories', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.stories.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });

  it('handles specs', () => {
    expect(
      extractReactComponents({
        files: [
          path.resolve(
            __dirname,
            '../../component-report/mocks/components/SomeComponent.spec.tsx',
          ),
        ],
      }),
    ).toEqual([
      path.resolve(
        __dirname,
        '../../component-report/mocks/components/SomeComponent',
      ),
    ]);
  });
});

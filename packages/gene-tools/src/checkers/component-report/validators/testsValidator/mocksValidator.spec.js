const { getUnnecessaryMocks } = require('./mocksValidator');

describe('getUnnecessaryMocks', () => {
  it('returns null when there are no mocks', () => {
    const testsSrc = `
      import { something } from '@brainly-gene/server-logger';

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBeNull();
  });

  it('returns null when there are mocks but none from @brainly-gene/core path', () => {
    const testsSrc = `
      import { something } from '@brainly-gene/server-logger';

      jest.mock('@brainly-gene/server-logger');

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBeNull();
  });

  it('returns message when there are unnecessary mocks from @brainly-gene/core path', () => {
    const testsSrc = `
      import { something } from '@brainly-gene/core';

      jest.mock('@brainly-gene/core');

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBe(
      'There are unnecessary mocks on modules: `@brainly-gene/core`',
    );
  });

  it('returns message when there are multiple unnecessary mocks from @brainly-gene/core path', () => {
    const testsSrc = `
      import { something } from '@brainly-gene/core';
      import { anotherThing } from '@brainly-gene/core';
      import { logger } from '@brainly-gene/server-logger';

      jest.mock('@brainly-gene/core');
      jest.mock('@brainly-gene/server-logger');

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBe(
      'There are unnecessary mocks on modules: `@brainly-gene/core`',
    );
  });
});

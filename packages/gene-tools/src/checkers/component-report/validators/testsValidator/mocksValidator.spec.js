const { getUnnecessaryMocks } = require('./mocksValidator');

describe('getUnnecessaryMocks', () => {
  it('returns null when there are no mocks', () => {
    const testsSrc = `
      import { something } from '@brainly/server-logger';

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBeNull();
  });

  it('returns null when there are mocks but none from @brainly/gene path', () => {
    const testsSrc = `
      import { something } from '@brainly/server-logger';

      jest.mock('@brainly/server-logger');

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBeNull();
  });

  it('returns message when there are unnecessary mocks from @brainly/gene path', () => {
    const testsSrc = `
      import { something } from '@brainly/gene';

      jest.mock('@brainly/gene');

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBe(
      'There are unnecessary mocks on modules: `@brainly/gene`'
    );
  });

  it('returns message when there are multiple unnecessary mocks from @brainly/gene path', () => {
    const testsSrc = `
      import { something } from '@brainly/gene';
      import { anotherThing } from '@brainly/gene';
      import { logger } from '@brainly/server-logger';

      jest.mock('@brainly/gene');
      jest.mock('@brainly/server-logger');

      const result = something();
    `;
    const result = getUnnecessaryMocks({ testsSrc });
    expect(result).toBe(
      'There are unnecessary mocks on modules: `@brainly/gene`'
    );
  });
});

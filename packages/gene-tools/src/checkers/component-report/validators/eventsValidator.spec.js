const {validateEvents} = require('./eventsValidator');
const path = require('path');
const {getWorkspaceLibConfigByPath, tsPathToWebpackAliases} = require('../../../scripts');

jest.mock(
  '../../../scripts',
  () => ({
    getWorkspaceLibConfigByPath: jest.fn(),
    tsPathToWebpackAliases: jest.fn(),
  })
);

describe('validateEvents()', () => {
  it('is valid for a valid use of dispatch', () => {
    const result = validateEvents(
      path.resolve(__dirname, '../mocks/components/ValidDispatch.tsx')
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('does not validate event namespace for private component', () => {
    const result = validateEvents(
      path.resolve(__dirname, '../mocks/components/ValidDispatchPrivate.tsx')
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('detects dispatching not declared events', () => {
    const result = validateEvents(
      path.resolve(__dirname, '../mocks/components/InvalidDispatch.tsx')
    );

    expect(result).toEqual({
      valid: false,
      error: 'Dispatching non-declared event: CONTENT_CLICKED',
    });
  });

  it('in valid for event type imported from type:utility lib with same domain tag', () => {
    const sourceLibConfig = {
      root: 'libs/example',
      sourceRoot: 'libs/example/lib/src',
      projectType: 'library',
      tags: ['domain:example', 'type:utility'],
      targets: {},
    };
    const targetLibConfig = {
      root: 'libs/example/components',
      sourceRoot: 'libs/example/components/src',
      projectType: 'library',
      tags: ['domain:example', 'type:module'],
      targets: {},
    };

    tsPathToWebpackAliases.mockReturnValue({
      '@acme/example': '/libs/components/lib/src/index.ts',
    });
    getWorkspaceLibConfigByPath
      .mockReturnValueOnce(sourceLibConfig)
      .mockReturnValue(targetLibConfig);
    const result = validateEvents(
      path.resolve(__dirname, '../mocks/components/ExternalTypeDispatch.tsx')
    );

    expect(result).toEqual({
      valid: true,
    });
  });

  it('in not valid for event type imported from type:utility lib with other domain tag', () => {
    const sourceLibConfig = {
      root: 'libs/example',
      sourceRoot: 'libs/example/lib/src',
      projectType: 'library',
      tags: ['domain:example', 'type:utility'],
      targets: {},
    };
    const targetLibConfig = {
      root: 'libs/example/components',
      sourceRoot: 'libs/example/components/src',
      projectType: 'library',
      tags: ['domain:other', 'type:module'],
      targets: {},
    };

    tsPathToWebpackAliases.mockReturnValue({
      '@acme/example': '/libs/example/lib/src/index.ts',
    });
    getWorkspaceLibConfigByPath
      .mockReturnValueOnce(sourceLibConfig)
      .mockReturnValue(targetLibConfig);
    const result = validateEvents(
      path.resolve(__dirname, '../mocks/components/ExternalTypeDispatch.tsx')
    );

    expect(result).toEqual({
      valid: false,
      error:
        'Non-recognized event namespace: ExampleEventsType (expected ExternalTypeDispatchEventsType)',
    });
  });

  it('in not valid for event type imported from lib without type:utility tag', () => {
    const sourceLibConfig = {
      root: 'libs/example',
      sourceRoot: 'libs/example/lib/src',
      projectType: 'library',
      tags: ['domain:example', 'type:component'],
      targets: {},
    };
    const targetLibConfig = {
      root: 'libs/example/components',
      sourceRoot: 'libs/example/components/src',
      projectType: 'library',
      tags: ['domain:example', 'type:module'],
      targets: {},
    };

    tsPathToWebpackAliases.mockReturnValue({
      '@acme/example': '/libs/components/lib/src/index.ts',
    });
    getWorkspaceLibConfigByPath
      .mockReturnValueOnce(sourceLibConfig)
      .mockReturnValue(targetLibConfig);
    const result = validateEvents(
      path.resolve(__dirname, '../mocks/components/ExternalTypeDispatch.tsx')
    );

    expect(result).toEqual({
      valid: false,
      error:
        'Non-recognized event namespace: ExampleEventsType (expected ExternalTypeDispatchEventsType)',
    });
  });

  it('in not valid for event type imported from type:utility lib without domain tag', () => {
    const sourceLibConfig = {
      root: 'libs/example',
      sourceRoot: 'libs/example/lib/src',
      projectType: 'library',
      tags: ['type:utility'],
      targets: {},
    };
    const targetLibConfig = {
      root: 'libs/example/components',
      sourceRoot: 'libs/example/components/src',
      projectType: 'library',
      tags: ['domain:example', 'type:module'],
      targets: {},
    };

    tsPathToWebpackAliases.mockReturnValue({
      '@acme/example': '/libs/components/lib/src/index.ts',
    });
    getWorkspaceLibConfigByPath
      .mockReturnValueOnce(sourceLibConfig)
      .mockReturnValue(targetLibConfig);

    const result = validateEvents(
      path.resolve(__dirname, '../mocks/components/ExternalTypeDispatch.tsx')
    );

    expect(result).toEqual({
      valid: false,
      error:
        'Non-recognized event namespace: ExampleEventsType (expected ExternalTypeDispatchEventsType)',
    });
  });
});

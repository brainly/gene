/* eslint-disable */
export default {
  displayName: 'e2e-testing-providers',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        //#region this disables type checking for all test files, though it speeds up the tests significantly
        isolatedModules: true,
        diagnostics: {
          exclude: ['**'],
        },
        //#endregion
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/e2e-testing-providers',
  setupFilesAfterEnv: ['../../jest.setup.js'],
  globals: {},
};

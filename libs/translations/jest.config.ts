/* eslint-disable */
export default {
  displayName: 'translations',
  preset: '../../jest.preset.js',
  transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/translations',
  setupFilesAfterEnv: ['../../jest.setup.js'],
  globals: {
    'ts-jest': {
      //#region this disables type checking for all test files, though it speeds up the tests significantly
      isolatedModules: true,
      diagnostics: {
        exclude: ['**'],
      },
      //#endregion
    },
  },
};

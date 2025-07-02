/* eslint-disable */
export default {
  displayName: 'gene-tools',
  preset: '../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/gene-tools',
  testPathIgnorePatterns: [
    '<rootDir>/src/generators/workspace-executor',
    '<rootDir>/src/checkers/component-report/mocks',
    '<rootDir>/src/checkers/module-report/mocks',
  ],
};

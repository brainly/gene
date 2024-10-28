export default {
  plugins: ['jest'],
  extends: ['plugin:jest/recommended'],
  rules: {
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/consistent-type-exports': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',

    'import/no-anonymous-default-export': 'off',

    'jest/no-mocks-import': 'off',
    'jest/consistent-test-it': ['error', { fn: 'it' }],
    'jest/valid-title': [
      'error',
      {
        mustNotMatch: {
          it: ['\\.$', 'Title should not end with a full-stop'],
          describe: ['(?<!:)$', 'title should end with colon `:`'],
        },
        mustMatch: {
          it: [
            '^(?:should|must|is|\\b(should|must|is)\\b)',
            'Title should start with one of the following prefixes: \n- should\n- must\n- is\n',
          ],
          describe: [
            '^(?:[A-Z]|\\b(when|with|without|if|unless|for)\\b)',
            'Title should either start with a capital letter or one of the following prefixes: \n- when\n- with\n- without\n- if\n- unless\n- for\n',
          ],
        },
      },
    ],
  },
};

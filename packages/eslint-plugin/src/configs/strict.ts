export default {
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
      typescript: {
        // always try to resolve types under `<root>@types` directory even it doesn't contain any source code
        alwaysTryTypes: true,
        // list of tsconfig.json files which should be used by the resolver, omit to use <root>/tsconfig.json by default
        project: [
          'tsconfig.base.json',
          '{apps,packages,libs}/**/*/tsconfig?(.){spec,lib,app,}.json',
        ],
        typescript: true,
        node: true,
      },
    },
  },
  reportUnusedDisableDirectives: true,
  rules: {
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'off',
    'import/default': 'off',
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    complexity: ['error', 4],
    'no-console': ['error', { allow: ['error'] }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
    ],
    'object-shorthand': 'error',
    'no-else-return': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/apps/**/*'],
            message:
              "You can't import from apps/. Consider moving shared code to a packages/",
          },
          {
            group: ['**/packages/**/*'],
            message:
              "You can't import from packages/ directly. Please use absolute imports from the root of the project.",
          },
          {
            group: ['**/libs/**/*'],
            message:
              "You can't import from libs/ directly. Please use absolute imports from the root of the project.",
          },
        ],
      },
    ],
  },
};

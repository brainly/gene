export default {
  // plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@nx/typescript',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // 'plugin:import/typescript',
  ],
  rules: {
    // '@typescript-eslint/no-unused-vars': ['error', { vars: 'all' }],
    // 'import/consistent-type-specifier-style': 'error',
    // '@typescript-eslint/consistent-type-exports': 'error',
    // '@typescript-eslint/consistent-type-imports': 'error',
    // '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@nx/enforce-module-boundaries': [
      'error',
      {
        enforceBuildableLibDependency: true,
        allow: [],
        depConstraints: [
          {
            sourceTag: 'domain:shared',
            onlyDependOnLibsWithTags: ['domain:shared'],
          },
          {
            sourceTag: 'scope:poc',
            onlyDependOnLibsWithTags: [
              'type:module',
              'type:ioc',
              'type:component',
              'type:service',
              'type:utility',
              'type:service',
            ],
          },
          {
            sourceTag: 'type:app',
            onlyDependOnLibsWithTags: [
              'type:module',
              'type:machine-module',
              'type:module-inheritor',
              'type:component',
              'type:utility',
              'type:service',
              'type:api-handler',
              'type:application-module-library',
            ],
          },
          {
            sourceTag: 'type:module',
            onlyDependOnLibsWithTags: [
              'type:ioc',
              'type:module-portable',
              'type:core-module',
              'type:component',
              'type:service',
              'type:utility',
              'type:machine',
              'type:vendor',
            ],
          },
          {
            sourceTag: 'type:core-module',
            onlyDependOnLibsWithTags: [
              'type:ioc',
              'type:component',
              'type:service',
              'type:utility',
              'type:machine',
              'type:vendor',
            ],
          },
          {
            sourceTag: 'type:machine-module',
            onlyDependOnLibsWithTags: [
              'type:ioc',
              'type:module',
              'type:component',
              'type:service',
              'type:utility',
              'type:machine',
              'type:vendor',
              'type:module-inheritor',
              'type:temporary-nested-machine-module',
            ],
          },
          {
            sourceTag: 'type:temporary-nested-machine-module',
            onlyDependOnLibsWithTags: [
              'type:ioc',
              'type:machine-module',
              'type:module',
              'type:component',
              'type:service',
              'type:utility',
              'type:machine',
              'type:vendor',
              'type:module-inheritor',
            ],
          },
          {
            sourceTag: 'type:module-inheritor',
            onlyDependOnLibsWithTags: [
              'type:ioc',
              'type:module',
              'type:module-inheritor',
              'type:component',
              'type:service',
              'type:utility',
              'type:machine',
              'type:vendor',
            ],
          },
          {
            sourceTag: 'type:application-module-library',
            onlyDependOnLibsWithTags: [
              'type:ioc',
              'type:core-module',
              'type:component',
              'type:service',
              'type:utility',
              'type:machine',
              'type:vendor',
            ],
          },
          {
            sourceTag: 'type:ioc',
            onlyDependOnLibsWithTags: [
              'type:ioc',
              'type:mediator',
              'type:component',
              'type:utility',
            ],
          },
          {
            sourceTag: 'type:mediator',
            onlyDependOnLibsWithTags: [
              'type:mediator',
              'type:component',
              'type:service',
              'type:utility',
            ],
          },
          {
            sourceTag: 'type:service',
            onlyDependOnLibsWithTags: [
              'type:service',
              'type:utility',
              'type:api-handler',
            ],
          },
          {
            sourceTag: 'type:component',
            onlyDependOnLibsWithTags: ['type:component', 'type:utility'],
          },
          {
            sourceTag: 'type:vendor',
            onlyDependOnLibsWithTags: [
              'type:utility',
              'type:component',
              'type:service',
            ],
          },
          {
            sourceTag: 'type:machine',
            onlyDependOnLibsWithTags: ['type:utility'],
          },
          {
            sourceTag: 'type:api-handler',
            onlyDependOnLibsWithTags: ['type:utility'],
          },
          {
            sourceTag: 'type:utility',
            onlyDependOnLibsWithTags: ['type:utility'],
          },
          {
            sourceTag: 'type:lambda',
            onlyDependOnLibsWithTags: ['type:api-handler'],
          },
        ],
      },
    ],
  },
};

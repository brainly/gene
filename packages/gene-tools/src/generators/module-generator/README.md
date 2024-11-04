# Module generator

Generats a new Gene module. Module will be added to dedicated lib used by host application. E2E Tests project is added by default and works on top of the Storybook.

## Usage

Run the following command and follow the instructions.

```
yarn nx g @brainly/gene-tools:module
```

```
Module library for app example-application-market-a was not found in libs/example-application/market-a/app-modules. Generating...

CREATE libs/example-application/market-a/app-modules/.eslintrc.json
CREATE libs/example-application/market-a/app-modules/.babelrc
CREATE libs/example-application/market-a/app-modules/src/index.ts
CREATE libs/example-application/market-a/app-modules/tsconfig.json
CREATE libs/example-application/market-a/app-modules/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/example-application/market-a/app-modules/jest.config.js
CREATE libs/example-application/market-a/app-modules/tsconfig.spec.json
CREATE libs/example-application/market-a/app-modules/src/README.md
CREATE libs/example-application/market-a/app-modules/src/lib/simple-module-module/ExampleApplicationMarketASimpleModuleModule.stories.tsx
CREATE libs/example-application/market-a/app-modules/src/lib/simple-module-module/ExampleApplicationMarketASimpleModuleModule.tsx
CREATE libs/example-application/market-a/app-modules/src/lib/simple-module-module/hooks/index.ts
CREATE libs/example-application/market-a/app-modules/src/lib/simple-module-module/index.ts
CREATE libs/example-application/market-a/app-modules/.storybook/main.js
CREATE libs/example-application/market-a/app-modules/.storybook/manager.js
CREATE libs/example-application/market-a/app-modules/.storybook/preview.js
CREATE libs/example-application/market-a/app-modules/.storybook/tsconfig.json
```

Schema file for running this generator with appropriate description of options is available [here](./schema.json).

More info in [the documentation](https://brainly.github.io/gene/gene/modules/development-and-branching)

To run E2E tests for the module, run the command

```
nx social-qa-progress-tracking-module-e2e:e2e
```

# E2E testing providers library generator

This generator creates a library for E2E testing providers.


This lib is used in storybook files to allow easy mocking of IoC containers.


## Usage

```sh copy
nx g @brainly/gene-tools:e2e-providers
```

### Example run:

```
>  NX  Generating @brainly/gene-tools:e2e-providers

UPDATE nx.json
CREATE libs/e2e-testing-providers/project.json
CREATE libs/e2e-testing-providers/.eslintrc.json
CREATE libs/e2e-testing-providers/.babelrc
CREATE libs/e2e-testing-providers/README.md
CREATE libs/e2e-testing-providers/src/index.ts
CREATE libs/e2e-testing-providers/tsconfig.lib.json
CREATE libs/e2e-testing-providers/tsconfig.json
CREATE libs/e2e-testing-providers/jest.config.ts
CREATE libs/e2e-testing-providers/tsconfig.spec.json
UPDATE tsconfig.base.json
CREATE libs/e2e-testing-providers/src/lib/ioc/contextContainer.ts
CREATE libs/e2e-testing-providers/src/lib/ioc/index.ts
CREATE libs/e2e-testing-providers/src/lib/ioc/serviceClientsContainer.ts
CREATE libs/e2e-testing-providers/src/lib/storybook/decorators/StorybookProviders.module.scss
CREATE libs/e2e-testing-providers/src/lib/storybook/decorators/StorybookProviders.tsx
CREATE libs/e2e-testing-providers/src/lib/storybook/index.ts
```

# Core Module generator

Generats a new Core Gene module. E2E Tests project is added by default and works on top of the Storybook.

## Usage

Run the following command and follow the instructions.

```
yarn nx g @brainly-gene/tools:core-module
```

Schema file for running this generator with appropriate description of options is available [here](./schema.json).

More info in [the documentation](https://brainly.github.io/gene/gene/modules/development-and-branching)

Example run

```
✔ What is the module name? · progress-tracking
✔ What is the module directory? · social-qa/question/modules
✔ What are the module tags? ·

CREATE libs/social-qa/question/modules/progress-tracking-module/.eslintrc.json
CREATE libs/social-qa/question/modules/progress-tracking-module/.babelrc
CREATE libs/social-qa/question/modules/progress-tracking-module/README.md
CREATE libs/social-qa/question/modules/progress-tracking-module/src/index.ts
CREATE libs/social-qa/question/modules/progress-tracking-module/tsconfig.json
CREATE libs/social-qa/question/modules/progress-tracking-module/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/social-qa/question/modules/progress-tracking-module/jest.config.js
CREATE libs/social-qa/question/modules/progress-tracking-module/tsconfig.spec.json
CREATE libs/social-qa/question/modules/progress-tracking-module/src/lib/ProgressTrackingModule.stories.tsx
CREATE libs/social-qa/question/modules/progress-tracking-module/src/lib/ProgressTrackingModule.tsx
CREATE libs/social-qa/question/modules/progress-tracking-module/src/lib/hooks/index.ts
CREATE libs/social-qa/question/modules/progress-tracking-module/src/lib/index.ts
CREATE libs/social-qa/question/modules/progress-tracking-module/.storybook/main.js
CREATE libs/social-qa/question/modules/progress-tracking-module/.storybook/manager.js
CREATE libs/social-qa/question/modules/progress-tracking-module/.storybook/preview.js
CREATE libs/social-qa/question/modules/progress-tracking-module/.storybook/tsconfig.json
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/cypress.config.ts
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/src/fixtures/example.json
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/src/support/commands.ts
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/src/support/e2e.ts
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/tsconfig.json
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/.eslintrc.json
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/src/e2e/progress-tracking-module/display.ts
CREATE apps/social-qa-question-modules-progress-tracking-module-e2e/src/e2e/progress-tracking-module.feature

```

To run E2E tests for the module, run the command

```
nx social-qa-progress-tracking-module-e2e:e2e
```

### Directory prompt

When asked about library directory, consider it should be scoped to `libs` directory - so you should not provide `libs` when asked for directory.

Modules libs are always created in `modules` directory that is appended to provided path, if path did not consists of `modules` on the end.

Examples:

- `my-feature/my-subfeature` provided as a directory will make `my-module` generated in `libs/my-feature/my-subfeature/modules/my-module`
- `my-feature/my-subfeature/modules` provided as a directory will make `my-module` generated in `libs/my-feature/my-subfeature/modules/my-module`

### Dry run mode

Use the `--dry-run` flag to verify what files will be created without actually generating them.

Example:

```shell copy
yarn nx g @brainly-gene/tools:core-module --dry-run
```

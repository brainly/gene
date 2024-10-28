# Components library generator

This generator creates a library for components.

## Usage

### Example run:

```
yarn nx g @brainly-gene/tools:components-library answer-box

✨  Done in 2.61s.
✔ What is the library directory? · social-qa/components
✔ What are the module tags? · domain:social-qa

CREATE libs/social-qa/components/answer-box-ui/.eslintrc.json
CREATE libs/social-qa/components/answer-box-ui/.babelrc
CREATE libs/social-qa/components/answer-box-ui/README.md
CREATE libs/social-qa/components/answer-box-ui/src/index.ts
CREATE libs/social-qa/components/answer-box-ui/tsconfig.json
CREATE libs/social-qa/components/answer-box-ui/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/social-qa/components/answer-box-ui/jest.config.js
CREATE libs/social-qa/components/answer-box-ui/tsconfig.spec.json
CREATE libs/social-qa/components/answer-box-ui/src/index.js
CREATE libs/social-qa/components/answer-box-ui/src/index.js.map
CREATE libs/social-qa/components/answer-box-ui/.storybook/main.js
CREATE libs/social-qa/components/answer-box-ui/.storybook/manager.js
CREATE libs/social-qa/components/answer-box-ui/.storybook/preview.js
CREATE libs/social-qa/components/answer-box-ui/.storybook/tsconfig.json

```

Generated library name: `social-qa-question-components-answer-box-ui`

To generate component in that lib use component-generator with the generated lib name:

```
nx g @brainly-gene/tools:component social-qa-components-answer-box-ui
✨  Done in 2.77s.
✔ You will create a new component now. Which prompting options would you like to choose? · basic

✨  Done in 3.68s.
? What is the name of your component? TestComponent
CREATE libs/social-qa/components/answer-box-ui/src/lib/TestComponent/index.ts
CREATE libs/social-qa/components/answer-box-ui/src/lib/TestComponent/TestComponent.tsx
CREATE libs/social-qa/components/answer-box-ui/src/lib/TestComponent/TestComponent.spec.tsx
CREATE libs/social-qa/components/answer-box-ui/src/lib/TestComponent/TestComponent.stories.tsx
UPDATE libs/social-qa/components/answer-box-ui/src/index.ts
```

### Available tasks for generated library:

- test: nx test social-qa-components-answer-box-ui:test
- lint: nx test social-qa-components-answer-box-ui:lint
- storybook: nx test social-qa-components-answer-box-ui:storybook

### Directory

When asked about library directory, consider it should be scoped to `libs` directory - so you should not provide `libs` when asked for directory.

Component libs are always created in `components` directory that is appended to provided path, if path did not consists of `components` on the end.

Example:

- `my-feature/my-subfeature` provided as a directory will make `my-library` generated in `libs/my-feature/my-subfeature/components/my-library`
- `my-feature/my-subfeature/components` provided as a directory will make `my-library` generated in `libs/my-feature/my-subfeature/components/my-library`

### Dry run mode

Use `--dry-run` flag in order to check what files will be generated without generating them.

Example:

```
yarn nx g @brainly-gene/tools:components-library answer-box --dry-run
```

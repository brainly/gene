# Component generator

Generats a new component in selected library. Uses [schematic component](/packages/cli/src/component/README.md) under the hood in order to generate component for NX library.

## Usage

Run the following command and follow the instructions.

```
yarn nx g @brainly/gene-tools:component
```

Basic schema file for running this generator with appropriate description of options is available [here](./schema.json). Additional options are available in [component schematic](/packages/cli/src/component/schema.json).

More info in [the documentation](https://brainly.github.io/gene/components/create)

Example run

```
✔ You will create a new component now. Which prompting options would you like to choose? · sample

✔ What is name of library in which you want to create a component? · social-qa-question-components-question-box-ui

? What is the name of your component? my-component
CREATE libs/social-qa/question/components/question-box-ui/src/lib/MyComponent/index.ts
CREATE libs/social-qa/question/components/question-box-ui/src/lib/MyComponent/MyComponent.tsx
CREATE libs/social-qa/question/components/question-box-ui/src/lib/MyComponent/MyComponent.module.scss
CREATE libs/social-qa/question/components/question-box-ui/src/lib/MyComponent/MyComponent.spec.tsx
CREATE libs/social-qa/question/components/question-box-ui/src/lib/MyComponent/MyComponent.stories.tsx
CREATE libs/social-qa/question/components/question-box-ui/src/lib/MyComponent/MyComponentCopyType.ts
CREATE libs/social-qa/question/components/question-box-ui/src/lib/MyComponent/MyComponentEventsType.ts
UPDATE libs/social-qa/question/components/question-box-ui/src/index.ts

```

### Dry run mode

Use `--dry-run` flag in order to check what files will be generated without generating them.

Example:

```
yarn nx g @brainly/gene-tools:component --dry-run
```

# storybook-configuration

This generator allows to set up the Storybook configuration for a project.

## Usage

To generate the Storybook configuration for a project, run the following command:

```bash
nx g @brainly-gene/tools:storybook-configuration <library-name>
```

For example, if we want to generate the Storybook configuration for a project called `my-library`, we run the following command:

```bash
nx g @brainly-gene/tools:storybook-configuration my-library
```

We can also just run:

```bash
nx g @brainly-gene/tools:storybook-configuration
```

And follow the prompts to enter the required information.

## What it does?

The generator will perform the following tasks:

- Create a `.storybook` folder in the root of the project with the configuration files.
- Add the patterns for stories to the `exclude` property of the project's `tsconfig.json` file.
- Add the `build-storybook` and `storybook` targets to the project configuration.

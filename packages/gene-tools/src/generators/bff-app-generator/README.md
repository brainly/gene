# App generator

Generates a new Backend For Frontend BFF (NextJS NX application). Application is created by default with tag `type:app` and with one `index` page.

## Usage

Run the following command and follow the instructions.

```
yarn nx g @brainly/gene-tools:component
```

Schema file for running this generator with appropriate description of options is available [here](./schema.json).

Example run

```
✔ What is the BFF name? (e.g. web, ios, android)  · web
✔ Application tittle · Example BFF Application
✔ Application description · Example BFF Application for the US web
✔ Specify the path to the BFF directory relative to '/apps'? · examples/bff/us
✔ What are tags of the application?
✔ Should the application routes be translated? (y/N) · true
✔ Should include apollo client config? (Y/n) · true
✔ Should include react query config? (y/N) · true
✔ Should include e2e config? (Y/n) · true

CREATE apps/examples/bff/us/web/index.d.ts
CREATE apps/examples/bff/us/web/next-env.d.ts
CREATE apps/examples/bff/us/web/next.config.js
CREATE apps/examples/bff/us/web/public/.gitkeep
CREATE apps/examples/bff/us/web/tsconfig.json
CREATE apps/examples/bff/us/web-e2e/cypress.config.ts
CREATE apps/examples/bff/us/web-e2e/src/fixtures/example.json
CREATE apps/examples/bff/us/web-e2e/src/support/commands.ts
CREATE apps/examples/bff/us/web-e2e/src/support/e2e.ts
CREATE apps/examples/bff/us/web-e2e/tsconfig.json
CREATE apps/examples/bff/us/web-e2e/.eslintrc.json
CREATE apps/examples/bff/us/web/jest.config.js
CREATE apps/examples/bff/us/web/tsconfig.spec.json
CREATE apps/examples/bff/us/web/.eslintrc.json
CREATE apps/examples/bff/us/web/.env
CREATE apps/examples/bff/us/web/.gitignore
CREATE apps/examples/bff/us/web/README.md
CREATE apps/examples/bff/us/web/config/envVars.ts
CREATE apps/examples/bff/us/web/config/openApi.ts
CREATE apps/examples/bff/us/web/config/redirects.json
CREATE apps/examples/bff/us/web/config/rewrites.json
CREATE apps/examples/bff/us/web/ioc/baseIoc.ts
CREATE apps/examples/bff/us/web/ioc/getHomePageIoc.ts
CREATE apps/examples/bff/us/web/loadRewrites.js
CREATE apps/examples/bff/us/web/pages/api/docs/openapi.ts
CREATE apps/examples/bff/us/web/pages/api/health.ts
CREATE apps/examples/bff/us/web/pages/api/v1/endpoint.ts
CREATE apps/examples/bff/us/web/pages/api-docs.tsx
CREATE apps/examples/bff/us/web/public/nx-static/.gitignore
CREATE apps/examples/bff/us/web/public/nx-static/manifest.json
CREATE apps/examples/bff/us/web/types/types.ts
CREATE apps/examples/bff/us/web/withNodeModulesCSS.js
CREATE apps/examples/bff/us/web-e2e/src/e2e/Home/display.ts
CREATE apps/examples/bff/us/web-e2e/src/e2e/Home.feature
CREATE apps/examples/bff/us/web/.storybook/main.js
CREATE apps/examples/bff/us/web/.storybook/manager.js
CREATE apps/examples/bff/us/web/.storybook/preview.js
CREATE apps/examples/bff/us/web/.storybook/tsconfig.json
```

We can test the new application by running the application

```
yarn nx run examples-bff-web:serve
```

The new application is available at `http://localhost:4200/`

### Dry run mode

Use `--dry-run` flag in order to check what files will be generated without generating them.

Example:

```
yarn nx g @brainly/gene-tools:bff-app --name web --directory examples/bff/us --tags social-qa --rewrites true --apollo true --reactQuery true --e2e true
```

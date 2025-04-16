# App generator

Generats a new NextJS NX application. Application is created by default with tag `type:app` and with one `index` page.

## Usage

Run the following command and follow the instructions.

```
yarn nx g @brainly-gene/tools:nextjs-app
```

Schema file for running this generator with appropriate description of options is available [here](./schema.json).

Example run

```
✔ What is the application name? · hi
✔ What is the application directory? · example.com
✔ What are tags of the application? ·
✔ Should the application routes be translated? (y/N) · true
✔ Which API providers should the application be provided with? · apollo, reactQuery

UPDATE nx.json
CREATE apps/example.com/hi/.babelrc
CREATE apps/example.com/hi/index.d.ts
CREATE apps/example.com/hi/next-env.d.ts
CREATE apps/example.com/hi/next.config.js
CREATE apps/example.com/hi/pages/index.tsx
CREATE apps/example.com/hi/pages/_app.tsx
CREATE apps/example.com/hi/pages/styles.css
CREATE apps/example.com/hi/public/.gitkeep
CREATE apps/example.com/hi/public/nx-logo-white.svg
CREATE apps/example.com/hi/public/star.svg
CREATE apps/example.com/hi/specs/index.spec.tsx
CREATE apps/example.com/hi/tsconfig.json
CREATE apps/example.com/hi/jest.config.js
CREATE apps/example.com/hi/tsconfig.spec.json
CREATE apps/example.com/hi/.eslintrc.json
CREATE apps/example.com/hi/common/apolloClient.ts
CREATE apps/example.com/hi/common/ioc/baseIoc.ts
CREATE apps/example.com/hi/common/reactQueryClient.ts
CREATE apps/example.com/hi/config/rewrites.json
CREATE apps/example.com/hi/withNodeModulesCSS.js
CREATE apps/example.com/hi/.storybook/main.js
CREATE apps/example.com/hi/.storybook/preview.js
CREATE apps/example.com/hi/tsconfig.storybook.json

```

We can test the new application by running the application

```
nx run example.com-hi:serve
```

The new application is available at `http://localhost:4200/`

### Dry run mode

Use `--dry-run` flag in order to check what files will be generated without generating them.

Example:

```
yarn nx g @brainly-gene/tools:nextjs-app --name=myData --directory=my-feature/services --serviceType=apollo --dry-run
```

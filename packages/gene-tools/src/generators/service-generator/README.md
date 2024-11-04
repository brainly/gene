# Services generator

This generator is used for creating services for Gene applications. It allows you to choose between Apollo Client and ReactQuery Client.

## Usage

### Example run for creating an Apollo service:

```shell copy
nx generate @brainly/gene-tools:service --name=my-data --directory=my-feature/services --serviceType=apollo
```

The command produces the following output:

```
CREATE libs/my-feature/services/my-data-service/README.md
CREATE libs/my-feature/services/my-data-service/.babelrc
CREATE libs/my-feature/services/my-data-service/src/index.ts
CREATE libs/my-feature/services/my-data-service/tsconfig.json
CREATE libs/my-feature/services/my-data-service/tsconfig.lib.json
UPDATE tsconfig.base.json
UPDATE nx.json
CREATE libs/my-feature/services/my-data-service/.eslintrc.json
CREATE libs/my-feature/services/my-data-service/jest.config.js
CREATE libs/my-feature/services/my-data-service/tsconfig.spec.json
CREATE libs/my-feature/services/my-data-service/src/lib/queries.ts
CREATE libs/my-feature/services/my-data-service/src/lib/useMyData.ts
CREATE libs/my-feature/services/my-data-service/src/lib/useMyDataStatic.ts
```

Generated service name: `my-feature-services-my-data`

### Example run for creating a React Query service:

```shell copy
nx generate @brainly/gene-tools:service --name=my-data --directory=my-feature/services --serviceType=react-query
```

The command produces the following output:

```
CREATE libs/my-feature/services/my-data-service/README.md
CREATE libs/my-feature/services/my-data-service/.babelrc
CREATE libs/my-feature/services/my-data-service/src/index.ts
CREATE libs/my-feature/services/my-data-service/tsconfig.json
CREATE libs/my-feature/services/my-data-service/tsconfig.lib.json
UPDATE tsconfig.base.json
UPDATE nx.json
CREATE libs/my-feature/services/my-data-service/.eslintrc.json
CREATE libs/my-feature/services/my-data-service/jest.config.js
CREATE libs/my-feature/services/my-data-service/tsconfig.spec.json
CREATE libs/my-feature/services/my-data-service/src/lib/queries.ts
CREATE libs/my-feature/services/my-data-service/src/lib/useMyData.ts
CREATE libs/my-feature/services/my-data-service/src/lib/useMyDataStatic.ts
```

Generated service name: `my-feature-services-my-data`

### Available tasks for generated service:

- test: nx test my-feature-services-my-data:test
- lint: nx test my-feature-services-my-data:lint

Read full documentation [here](https://brainly.github.io/gene/services)

### Directory

When asked about library directory, consider it should be scoped to `libs` directory - so you should not provide `libs` when asked for directory.

Services libs are always created in `services` directory that is appended to provided path, if path did not consists of `services` on the end.

Example:

- `my-feature/my-subfeature` provided as a directory will make `my-service` generated in `libs/my-feature/my-subfeature/services/my-service`
- `my-feature/my-subfeature/services` provided as a directory will make `my-service` generated in `libs/my-feature/my-subfeature/services/my-service`

### Dry run mode

Use the `--dry-run` flag to verify what files will be created without actually generating them.

Example:

```shell copy
nx generate @brainly/gene-tools:service --name=my-data --directory=my-feature/services --serviceType=apollo --dry-run
```

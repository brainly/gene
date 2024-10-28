# 🧬 Brainly Gene

[![Brainly Gene Framework - high level overview](http://img.youtube.com/vi/4A6s8aE_AzI/0.jpg)](https://gene.brainly.tech/gene)

Gene is an opinionated React framework designed to bridge the gap between develpmpent speed project maintainability and scalability.

It highly leverages the power of **code generations** and **automation**. It is built on top of [Nx](https://nx.dev/concepts/mental-model) and [Nx Workspace Generators](https://nx.dev/packages/workspace/documents/overview).

## [Contributing](https://github.com/brainly/gene/blob/master/CONTRIBUTING.md)

Development of Brainly Gene happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read [contribution guidelines](https://github.com/brainly/gene/blob/master/CONTRIBUTING.md) to learn how you can take part in improving Brainly Gene.

### [Code of Conduct](https://github.com/brainly/gene/blob/master/CODE_OF_CONDUCT.md)

Brainly Gene has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://github.com/brainly/gene/blob/master/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Development

To run gene generator inside this repo:

```sh
nx g @brainly/gene-tools:nextjs-app --name=my-test --directory=test-dir --tags=domain:test --rewrites=true --apollo=true --reactQuery=true --e2e=true  --verbose
```

It uses the code under packages/gene-tools/generators, so there is no need to build the package.

### [Trademark Guidelines](https://github.com/brainly/gene/blob/master/TRADEMARK.md)

Brainly Gene is a trademark of Brainly sp. z o.o. Please read [the full text](https://github.com/brainly/gene/blob/master/TRADEMARK.md) so that you can understand how to use our marks consistent with background law and community expectation.

### License

Brainly Gene is [Apache-2.0 licensed](https://github.com/brainly/gene/blob/master/LICENSE)

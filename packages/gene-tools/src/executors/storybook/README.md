# build-storybook

Custom executor which uses under the hood `nrwl/storybook` - but it is decorated with option: `NODE_OPTIONS=--openssl-legacy-provider`

We need this option to support old ssl provider in webpack4 - which is used by storybook 6 version we are using.

More info about this issue can be found here: https://stackoverflow.com/questions/75504981/use-legacy-openssl-provider-with-node-16-and-18

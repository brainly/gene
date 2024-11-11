import basic from './configs/basic';
import strict from './configs/strict';
import react from './configs/react';
import jest from './configs/jest';
import { rules } from './rules';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { USE_LISTENER_RULE_NAME } from './rules/use-listener';

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf8')
);

const pluginName = pkg.name.replace('/eslint-plugin', '');

const basicRules = {
  ...basic,
  rules: {
    ...basic.rules,
    [`${pluginName}/${USE_LISTENER_RULE_NAME}`]: 'error',
  },
};
const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {
    basic: basicRules,
    strict,
    react,
    jest,
    recommended: {
      plugins: ['regexp'],
      extends: ['plugin:import/recommended', 'plugin:regexp/recommended'],
      rules: {
        ...basicRules.rules,
      },
    },
  },
  rules,
};

module.exports = plugin;

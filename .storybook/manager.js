import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Gene Sandbox',
    brandUrl: 'https://github.com/brainly/gene/',
  }),
});

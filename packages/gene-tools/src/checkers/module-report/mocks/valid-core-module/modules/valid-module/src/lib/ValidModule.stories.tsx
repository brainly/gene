import React from 'react';
import { ValidModule } from './ValidModule';
import { ValidVariationModule } from './ValidVariationModule';

export default {
  title: 'valid-module',
};

export const CoreDefaultView = {
  render: () => <ValidModule />,
  name: 'core - default view',
};

export const CoreVariationView = {
  render: () => <ValidVariationModule />,
  name: 'core - variation view',
};

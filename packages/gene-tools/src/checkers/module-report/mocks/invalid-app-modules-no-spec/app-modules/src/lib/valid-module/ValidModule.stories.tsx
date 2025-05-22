import React from 'react';
import { ValidModule } from './ValidModule';
import { ValidVariationModule } from './ValidVariationModule';

export default {
  title: 'valid-module',
};

export const DefaultView = {
  render: () => <ValidModule />,
  name: 'default view',
};

export const ValidVariationModuleDefaultView = {
  render: () => <ValidVariationModule />,
  name: 'ValidVariationModule - default view',
};

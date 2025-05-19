import React from 'react';
import { ValidModule } from './ValidModule';
import { ValidVariationModule } from './ValidVariationModule';

export default {
  title: 'valid-module',
};

export const CoreDefaultView = () => <ValidModule />;

CoreDefaultView.story = {
  name: 'core - default view',
};

export const CoreVariationView = () => <ValidVariationModule />;

CoreVariationView.story = {
  name: 'core - variation view',
};

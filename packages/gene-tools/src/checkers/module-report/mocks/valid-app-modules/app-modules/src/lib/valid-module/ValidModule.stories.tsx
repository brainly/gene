import React from 'react';
import { ValidModule } from './ValidModule';
import { ValidVariationModule } from './ValidVariationModule';

export default {
  title: 'valid-module',
};

export const DefaultView = () => <ValidModule />;

DefaultView.story = {
  name: 'default view',
};

export const ValidVariationModuleDefaultView = () => <ValidVariationModule />;

ValidVariationModuleDefaultView.story = {
  name: 'ValidVariationModule - default view',
};

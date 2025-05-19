import React from 'react';
import { InvalidModule } from './InvalidModule';

export default {
  title: 'invalid-module',
};

export const CoreDefaultView = () => <InvalidModule />;

CoreDefaultView.story = {
  name: 'core - default view',
};

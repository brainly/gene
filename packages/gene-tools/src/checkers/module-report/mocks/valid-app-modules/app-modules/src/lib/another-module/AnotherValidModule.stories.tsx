import React from 'react';
import { AnotherValidModule } from './AnotherValidModule';

export default {
  title: 'another-module',
};

export const DefaultView = () => <AnotherValidModule />;

DefaultView.story = {
  name: 'default view',
};

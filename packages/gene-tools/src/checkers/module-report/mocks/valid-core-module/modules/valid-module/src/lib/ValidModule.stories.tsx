import React from 'react';
import { storiesOf } from '@storybook/react';
import { ValidModule } from './ValidModule';
import { ValidVariationModule } from './ValidVariationModule';

storiesOf('valid-module', module)
  .add('core - default view', () => <ValidModule />)
  .add('core - variation view', () => <ValidVariationModule />);

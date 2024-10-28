import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {InvalidModule} from './InvalidModule';

storiesOf('invalid-module', module)
  .add('default view', () => <InvalidModule />)

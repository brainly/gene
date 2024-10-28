import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {AnotherValidModule} from './AnotherValidModule';

storiesOf('another-module', module)
  .add('default view', () => <AnotherValidModule />)

import { ValidDispatchEventsType } from './ValidDispatchEventsType';

import React from 'react';
import { storiesOf } from '@storybook/react';
import { registerStoryInPackages, StorybookMediator } from '@brainly-gene/core';
import ValidDispatch from './ValidDispatch';
import { array } from '@storybook/addon-knobs';

const EVENTS_LIST = [
  {
    value: ValidDispatchEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

storiesOf(registerStoryInPackages('mocks/Dispatch'), module)
  .addDecorator((storyFn) => (
    <StorybookMediator events={EVENTS_LIST}>{storyFn()}</StorybookMediator>
  ))
  .add('default', () => (
    <ValidDispatch id="1" content="1" items={array('items', [])} />
  ));

import { ValidDispatchEventsType } from './ValidDispatchEventsType';

import React from 'react';
import { registerStoryInPackages, StorybookMediator } from '@brainly-gene/core';
import ValidDispatch from './ValidDispatch';
import { array } from '@storybook/addon-knobs';

const EVENTS_LIST = [
  {
    value: ValidDispatchEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

export const Default = {
  render: () => (
    <StorybookMediator events={EVENTS_LIST}>
      <ValidDispatch id="1" content="1" items={array('items', [])} />
    </StorybookMediator>
  ),
  name: 'Valid Dispatch - default view',
};

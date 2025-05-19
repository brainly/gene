import { ValidDispatchEventsType } from './ValidDispatchEventsType';

import React from 'react';
import { StorybookMediator } from '@brainly-gene/core';
import InvalidDispatch from './InvalidDispatch';
import { array } from '@storybook/addon-knobs';
import type { Meta, StoryObj } from '@storybook/react';

const EVENTS_LIST = [
  {
    value: ValidDispatchEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

const meta: Meta = {
  component: InvalidDispatch,
  decorators: [
    (Story) => (
      <StorybookMediator events={EVENTS_LIST}>
        <Story />
      </StorybookMediator>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = () => (
  <InvalidDispatch id="1" content="1" items={array('items', [])} />
);

Default.storyName = 'Invalid Dispatch';

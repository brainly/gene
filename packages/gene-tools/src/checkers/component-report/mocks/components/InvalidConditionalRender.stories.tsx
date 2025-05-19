import { ValidConditionalRenderEventsType } from './ValidConditionalRenderEventsType';

import React from 'react';
import { StorybookMediator } from '@brainly-gene/core';
import ValidConditionalRender from './ValidConditionalRender';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  component: ValidConditionalRender,
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

const EVENTS_LIST = [
  {
    value: ValidConditionalRenderEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

export const Default: Story = () => (
  <ValidConditionalRender firstName="Joe" lastName={null} booleanExample />
);

Default.storyName = 'Invalid Conditional Render';
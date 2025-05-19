import { ValidConditionalRenderEventsType } from './ValidConditionalRenderEventsType';

import React from 'react';
import { StorybookMediator } from '@brainly-gene/core';
import ValidConditionalRender from './ValidConditionalRender';
import { text } from '@storybook/addon-knobs';
import type { Meta, StoryObj } from '@storybook/react';

const EVENTS_LIST = [
  {
    value: ValidConditionalRenderEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

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

export const Default: Story = () => (
  <ValidConditionalRender
    firstName="Joe"
    lastName={text('last Name', 'Doe')}
    booleanExample={false}
  />
);

Default.storyName = 'Valid Conditional Render';

export const WithNegativeFirstName = () => (
  <ValidConditionalRender firstName={null} />
);

WithNegativeFirstName.storyName = 'with negative firstName';

export const WithPositiveBoolean = () => (
  <ValidConditionalRender booleanExample />
);

WithPositiveBoolean.storyName = 'with positive boolean';


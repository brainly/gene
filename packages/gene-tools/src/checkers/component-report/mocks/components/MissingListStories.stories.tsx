import { ValidDispatchEventsType } from './ValidDispatchEventsType';
import React from 'react';
import { StorybookMediator } from '@brainly-gene/core';
import type { Meta, StoryObj } from '@storybook/react';

const EVENTS_LIST = [
  {
    value: ValidDispatchEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

const meta: Meta = {
  title: 'mocks/MissingListStories',
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

export const Default: Story = {
  render: () => <></>,
  name: 'Missing List Stories',
};

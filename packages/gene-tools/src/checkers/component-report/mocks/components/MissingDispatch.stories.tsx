import { MissingDispatchEventsType } from './MissingDispatchEventsType';
import React from 'react';
import { StorybookMediator } from '@brainly-gene/tools/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

const EVENTS_LIST = [
  {
    value: MissingDispatchEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

const meta: Meta = {
  title: 'mocks/Dispatch',
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
  name: 'Default view',
};

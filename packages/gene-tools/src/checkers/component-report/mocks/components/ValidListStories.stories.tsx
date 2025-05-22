import { ValidListStoriesEventsType } from './ValidListStoriesEventsType';

import React from 'react';
import { StorybookMediator } from '@brainly-gene/core';
import ValidListStories from './ValidListStories';
import { array } from '@storybook/addon-knobs';
import type { Meta, StoryObj } from '@storybook/react';

const EVENTS_LIST = [
  {
    value: ValidListStoriesEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

const meta: Meta = {
  component: ValidListStories,
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
  render: () => (
    <ValidListStories
      text="Example title"
      list={[]}
      fourth={[]}
      second={array('second array', ['item 1'])}
      third={[]}
    />
  ),
  name: 'Valid List Stories - default view',
};

export const WithList: Story = {
  render: () => <ValidListStories list={['string', 'string']} />,
  name: 'with List',
};

export const WithThirdList: Story = {
  render: () => (
    <ValidListStories list={[]} fourth={['1', '2']} third={[1, 2, 3]} />
  ),
  name: 'with ThirdList',
};

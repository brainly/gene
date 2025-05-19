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

export const Default: Story = () => (
  <ValidListStories
    text="Example title"
    list={[]}
    fourth={[]}
    second={array('second array', ['item 1'])}
    third={[]}
  />
);

Default.storyName = 'Valid List Stories';

export const WithList: Story = () => <ValidListStories list={['string', 'string']} />;

WithList.storyName = 'with List';

export const WithThirdList = () => (
  <ValidListStories list={[]} fourth={['1', '2']} third={[1, 2, 3]} />
);

WithThirdList.storyName = 'with ThirdList';


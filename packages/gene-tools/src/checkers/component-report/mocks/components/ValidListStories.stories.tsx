import { ValidListStoriesEventsType } from './ValidListStoriesEventsType';

import React from 'react';
import { storiesOf } from '@storybook/react';
import { registerStoryInPackages, StorybookMediator } from '@brainly-gene/core';
import ValidListStories from './ValidListStories';
import { array } from '@storybook/addon-knobs';

const EVENTS_LIST = [
  {
    value: ValidListStoriesEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

storiesOf(registerStoryInPackages('mocks/Dispatch'), module)
  .addDecorator((storyFn) => (
    <StorybookMediator events={EVENTS_LIST}>{storyFn()}</StorybookMediator>
  ))
  .add('default', () => (
    <ValidListStories
      text="Example title"
      list={[]}
      fourth={[]}
      second={array('second array', ['item 1'])}
      third={[]}
    />
  ))
  .add('with List', () => <ValidListStories list={['string', 'string']} />)
  .add('with ThirdList', () => (
    <ValidListStories list={[]} fourth={['1', '2']} third={[1, 2, 3]} />
  ));

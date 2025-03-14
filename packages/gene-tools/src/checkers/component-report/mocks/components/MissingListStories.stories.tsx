import {ValidDispatchEventsType} from './ValidDispatchEventsType';

import React from 'react';
import {storiesOf} from '@storybook/react';
import {registerStoryInPackages, StorybookMediator} from '@brainly-gene/core';
import MissingListStories from './MissingListStories';

const EVENTS_LIST = [
  {
    value: ValidDispatchEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

storiesOf(registerStoryInPackages('mocks/Dispatch'), module)
  .addDecorator(storyFn => (
    <StorybookMediator events={EVENTS_LIST}>{storyFn()}</StorybookMediator>
  ))
  .add('default', () => <MissingListStories />);

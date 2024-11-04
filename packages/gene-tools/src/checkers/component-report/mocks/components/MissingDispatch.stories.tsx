import {MissingDispatchEventsType} from './MissingDispatchEventsType';

import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {registerStoryInPackages, StorybookMediator} from '@brainly/gene';

const EVENTS_LIST = [
  {
    value: MissingDispatchEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

storiesOf(registerStoryInPackages('mocks/Dispatch'), module).addDecorator(
  storyFn => (
    <StorybookMediator events={EVENTS_LIST}>{storyFn()}</StorybookMediator>
  )
);

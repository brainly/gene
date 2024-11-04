import {ValidConditionalRenderEventsType} from './ValidConditionalRenderEventsType';

import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {registerStoryInPackages, StorybookMediator} from '@brainly/gene';
import ValidConditionalRender from './ValidConditionalRender';

const EVENTS_LIST = [
  {
    value: ValidConditionalRenderEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

storiesOf(registerStoryInPackages('mocks/InvalidConditionalRender'), module)
  .addDecorator(storyFn => (
    <StorybookMediator events={EVENTS_LIST}>{storyFn()}</StorybookMediator>
  ))
  .add('default', () => (
    <ValidConditionalRender firstName="Joe" lastName={null} booleanExample />
  ));

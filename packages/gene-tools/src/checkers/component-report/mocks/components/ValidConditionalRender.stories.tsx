import { ValidConditionalRenderEventsType } from './ValidConditionalRenderEventsType';

import React from 'react';
import { storiesOf } from '@storybook/react';
import { registerStoryInPackages, StorybookMediator } from '@brainly-gene/core';
import ValidConditionalRender from './ValidConditionalRender';
import { text } from '@storybook/addon-knobs';

const EVENTS_LIST = [
  {
    value: ValidConditionalRenderEventsType.ON_DIV_CLICK,
    description: 'Runs on button click',
  },
];

storiesOf(registerStoryInPackages('mocks/ValidConditionalRender'), module)
  .addDecorator((storyFn) => (
    <StorybookMediator events={EVENTS_LIST}>{storyFn()}</StorybookMediator>
  ))
  .add('default', () => (
    <ValidConditionalRender
      firstName="Joe"
      lastName={text('last Name', 'Doe')}
      booleanExample={false}
    />
  ))
  .add('with negative firstName', () => (
    <ValidConditionalRender firstName={null} />
  ))
  .add('with positive boolean', () => (
    <ValidConditionalRender booleanExample />
  ));

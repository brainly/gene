import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {registerStoryInPackages} from '@brainly/gene';
import ValidConditionalRenderWithoutKnobs from './ValidConditionalRenderWithoutKnobs';

storiesOf(registerStoryInPackages('components/ProgressTrackingItem'), module)
  .add('Default view', () => (
    <ValidConditionalRenderWithoutKnobs variation={66} />
  ))
  .add('without variation', () => (
    <ValidConditionalRenderWithoutKnobs variation={-55} />
  ));

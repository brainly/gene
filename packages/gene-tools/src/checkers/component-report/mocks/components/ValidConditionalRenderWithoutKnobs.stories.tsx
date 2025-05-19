import React from 'react';
import { registerStoryInPackages } from '@brainly-gene/core';
import ValidConditionalRenderWithoutKnobs from './ValidConditionalRenderWithoutKnobs';

export const DefaultView = () => (
  <ValidConditionalRenderWithoutKnobs variation={66} />
);

DefaultView.story = {
  name: 'Default view',
};

export const WithoutVariation = () => (
  <ValidConditionalRenderWithoutKnobs variation={-55} />
);

WithoutVariation.story = {
  name: 'without variation',
};

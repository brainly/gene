import React from 'react';
import ValidConditionalRenderWithoutKnobs from './ValidConditionalRenderWithoutKnobs';

export const DefaultView = {
  render: () => <ValidConditionalRenderWithoutKnobs variation={66} />,
  name: 'Default view',
};

export const WithoutVariation = {
  render: () => <ValidConditionalRenderWithoutKnobs variation={-55} />,
  name: 'without variation',
};

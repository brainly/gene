import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'invalid-module',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <></>,
  name: 'Default view',
};

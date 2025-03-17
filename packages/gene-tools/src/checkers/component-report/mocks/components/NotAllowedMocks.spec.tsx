import React from 'react';
import { render } from '@testing-library/react';
import CmpsList from './NotApplyListSpecCoverage';

jest.mock('@brainly-gene/core-xyz', () => ({
  testFn: jest.fn(),
}));

describe('<Cmp />', () => {
  it('check nothing', () => {
    const cmps = render(<CmpsList cmps={[]} />);
  });
});

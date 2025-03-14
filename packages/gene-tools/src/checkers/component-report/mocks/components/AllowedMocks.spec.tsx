import React from 'react';
import {render} from '@testing-library/react';
import CmpsList from './NotApplyListSpecCoverage';

jest.mock('react-intersection-observer', () => ({
  testFn: jest.fn(),
}));

describe('<Cmp />', () => {
  it('check nothing', () => {
    const cmps = render(<CmpsList cmps={[]} />);
  });
});

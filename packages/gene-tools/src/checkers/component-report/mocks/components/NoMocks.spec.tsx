import React from 'react';
import {render} from '@testing-library/react';
import CmpsList from './NotApplyListSpecCoverage';

describe('<Cmp />', () => {
  it('check nothing', () => {
    const cmps = render(<CmpsList cmps={[]} />);
  });
});

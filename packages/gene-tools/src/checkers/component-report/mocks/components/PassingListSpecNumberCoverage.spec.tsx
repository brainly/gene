import React from 'react';
import { render } from '@testing-library/react';
import CmpsList from './PassingListSpecNumberCoverage';

describe('<Cmp />', () => {
  it('handle empty list', () => {
    const cmps = render(<CmpsList cmps={[]} />);

    expect(cmps).toHaveLength(0);
  });

  it('handle list', () => {
    const cmps = render(<CmpsList cmps={[1, 2]} />);

    expect(cmps).toHaveLength(2);
  });
});

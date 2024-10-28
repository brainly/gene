import * as React from 'react';
import {render} from '@testing-library/react';
import CmpsList from './PassingListSpecCoverage';

describe('<Cmp />', () => {
  it('check nothing', () => {
    const cmps = render(<CmpsList cmps={[]} />);
  });
});

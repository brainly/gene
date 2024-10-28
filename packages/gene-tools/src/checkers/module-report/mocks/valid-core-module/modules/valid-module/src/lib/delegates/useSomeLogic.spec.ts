import { renderHook } from '@testing-library/react';
import { useSomeLogic } from './useSomeLogic';
import { useRef } from 'react';

describe('useSomeLogic', () => {
  it('should return an object with someProps property', () => {
    const { result } = renderHook(() => {
      const ref = useRef(null);
      return useSomeLogic({ref});
    });

    expect(result.current).toHaveProperty('someProps');
  });
});

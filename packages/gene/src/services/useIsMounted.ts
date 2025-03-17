import React, { useLayoutEffect } from 'react';

export function useIsMounted(): () => boolean {
  const mountedRef = React.useRef(false);
  const isMounted = React.useCallback(() => mountedRef.current, []);

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return isMounted;
}

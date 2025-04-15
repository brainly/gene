import React, { useCallback } from 'react';

interface Props {
  id: string;
  onClick: (id: string) => void;
}

const InlineArrowWithMemoizedCall = React.memo(({ id, onClick }: Props) => {
  const handleClick = useCallback(
    (itemId: string) => {
      onClick(itemId);
    },
    [onClick]
  );

  return <button onClick={() => handleClick(id)}>Click me</button>;
});

export default InlineArrowWithMemoizedCall;

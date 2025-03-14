import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const InvalidPropsForwardRef = React.forwardRef<
  HTMLDivElement | null,
  PropsType
>(({ id, content, items }, x) => {
  return null;
});

export default React.memo<PropsType>(InvalidPropsForwardRef);

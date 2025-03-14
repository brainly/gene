import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
  onClick: () => unknown;
}>;

const CallbackProp = ({id, content, items}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(CallbackProp);

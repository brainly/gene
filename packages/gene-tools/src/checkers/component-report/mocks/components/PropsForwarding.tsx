import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingFunc = ({id, content, items}: PropsType) => {
  return <div data-items={items}></div>;
};

export default React.memo<PropsType>(PassingFunc);

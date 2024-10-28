import * as React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingFuncCall = ({id, content, items}: PropsType) => {
  const getId = () => 'div-42';

  return <div id={getId()}></div>;
};

export default React.memo<PropsType>(PassingFuncCall);

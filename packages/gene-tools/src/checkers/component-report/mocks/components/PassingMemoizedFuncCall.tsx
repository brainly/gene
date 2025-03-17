import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingMemoizedFuncCall = ({ id, content, items }: PropsType) => {
  const getId = React.useCallback((argument) => argument, []);

  return <div id={getId(123)}></div>;
};

export default React.memo<PropsType>(PassingMemoizedFuncCall);

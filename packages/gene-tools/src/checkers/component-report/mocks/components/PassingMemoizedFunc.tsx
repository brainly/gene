import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingMemoizedFunc = ({ id, content, items }: PropsType) => {
  const handler = React.useCallback(() => {
    return null;
  }, []);

  return <div onClick={handler}></div>;
};

export default React.memo<PropsType>(PassingMemoizedFunc);

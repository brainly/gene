import * as React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingFunc = ({id, content, items}: PropsType) => {
  function handler() {
    return null;
  }

  return <div onClick={handler}></div>;
};

export default React.memo<PropsType>(PassingFunc);

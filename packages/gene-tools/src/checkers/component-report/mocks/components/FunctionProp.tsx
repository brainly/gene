import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
  doQuickMath: (a: number) => number;
}>;

const FunctionProp = ({id, content, items}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(FunctionProp);

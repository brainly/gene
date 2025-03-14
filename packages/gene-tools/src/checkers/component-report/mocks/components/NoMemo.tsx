import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const NoMemo = ({ id, content, items }: PropsType) => {
  return null;
};

export default NoMemo;

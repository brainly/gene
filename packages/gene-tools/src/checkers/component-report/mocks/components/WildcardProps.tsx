import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
  [key: string]: any;
}>;

const WildcardProps = ({ id, content, items }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(WildcardProps);

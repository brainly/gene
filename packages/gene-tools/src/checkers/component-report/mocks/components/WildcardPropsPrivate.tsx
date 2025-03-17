import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
  [key: string]: any;
}>;

/* @private */
const WildcardPropsPrivate = ({ id, content, items }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(WildcardPropsPrivate);

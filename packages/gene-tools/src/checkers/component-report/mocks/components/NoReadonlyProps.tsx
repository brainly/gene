import React from 'react';

type PropsType = {
  id: string;
  content: string;
  items: Array<unknown>;
};

const NoReadonlyProps = ({ id, content, items }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(NoReadonlyProps);

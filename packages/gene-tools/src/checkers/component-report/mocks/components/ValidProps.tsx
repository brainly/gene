import * as React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const ValidProps = ({id, content, items}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(ValidProps);

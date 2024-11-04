import * as React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const ValidPropsForwardRef = React.forwardRef(
  ({id, content, items}: PropsType, ref) => {
    return null;
  }
);

export default React.memo<PropsType>(ValidPropsForwardRef);

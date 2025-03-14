import React from 'react';
import {dispatch} from '@brainly-gene/core';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const InlineArrowFunc = ({id, content, items}: PropsType) => {
  const handleContentClick = React.useCallback(
    (e: React.SyntheticEvent<HTMLElement>) => {
      dispatch(e.target, ['CONTENT_CLICKED', {foo: 'bar'}]);
    },
    []
  );

  return (
    <>
      <div onClick={handleContentClick}>click me</div>
    </>
  );
};

export default React.memo<PropsType>(InlineArrowFunc);

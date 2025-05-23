import React from 'react';
import { dispatch } from '@brainly-gene/core';
import { ValidDispatchEventsType, ClickEvent } from './ValidDispatchEventsType';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

/* @private */
const ValidDispatchPrivate = ({ id, content, items }: PropsType) => {
  const handleContentClick = React.useCallback(
    (e: React.SyntheticEvent<HTMLElement>) => {
      dispatch<ClickEvent>(e.target, [ValidDispatchEventsType.ON_DIV_CLICK]);
    },
    [],
  );

  return (
    <>
      <div onClick={handleContentClick}>click me</div>
    </>
  );
};

export default React.memo<PropsType>(ValidDispatchPrivate);

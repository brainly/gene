import * as React from 'react';
import {dispatch} from '@brainly/gene';
import {ExampleOnClickType, ExampleEventsType} from '@acme/example';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const InlineArrowFunc = ({id, content, items}: PropsType) => {
  const handleContentClick = React.useCallback(
    (e: React.SyntheticEvent<HTMLElement>) => {
      dispatch<ExampleOnClickType>(e.target, [
        ExampleEventsType.ON_CLICK,
        {foo: 'bar'},
      ]);
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

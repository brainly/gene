import * as React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingObject = ({id, content, items}: PropsType) => {
  const object = {foo: 'bar'};

  return <div data-obj={object}></div>;
};

export default React.memo<PropsType>(PassingObject);

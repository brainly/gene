import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const object = {foo: 'bar'};

const PassingObjectFromOutside = ({id, content, items}: PropsType) => {
  return <div data-obj={object}></div>;
};

export default React.memo<PropsType>(PassingObjectFromOutside);

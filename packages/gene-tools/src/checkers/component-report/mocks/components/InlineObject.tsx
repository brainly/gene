import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const InlineArrowFunc = ({ id, content, items }: PropsType) => {
  return (
    <>
      <div data-obj={{ foo: 'bar' }}>click me</div>
    </>
  );
};

export default React.memo<PropsType>(InlineArrowFunc);

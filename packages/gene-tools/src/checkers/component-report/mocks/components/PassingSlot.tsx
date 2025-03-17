import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingSlot = ({ id, content, items }: PropsType) => {
  const slot = <div>hello</div>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <div slot={slot}></div>;
};

export default React.memo<PropsType>(PassingSlot);

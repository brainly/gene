import * as React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingInlineSlot = ({id, content, items}: PropsType) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <div slot={<div>hello</div>}></div>;
};

export default React.memo<PropsType>(PassingInlineSlot);

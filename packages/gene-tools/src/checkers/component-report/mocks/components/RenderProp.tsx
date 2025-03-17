import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
  renderContent: (content: string) => React.ReactNode;
}>;

const RenderProp = ({ id, content, items }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(RenderProp);

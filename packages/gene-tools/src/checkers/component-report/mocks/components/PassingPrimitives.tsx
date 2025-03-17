import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingPrimitives = ({ id, content, items }: PropsType) => {
  const handler = React.useCallback(() => {
    return null;
  }, []);

  const value = 'foo';

  return <input value={value} onChange={handler} />;
};

export default React.memo<PropsType>(PassingPrimitives);

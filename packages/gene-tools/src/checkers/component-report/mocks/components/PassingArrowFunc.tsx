import * as React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const PassingArrowFunc = ({id, content, items}: PropsType) => {
  const handler = () => {
    return null;
  };

  const anotherHandler = () => {
    return null;
  };

  return (
    <>
      <div onClick={handler}>click me</div>
      <div onClick={anotherHandler}>or me</div>
    </>
  );
};

export default React.memo<PropsType>(PassingArrowFunc);

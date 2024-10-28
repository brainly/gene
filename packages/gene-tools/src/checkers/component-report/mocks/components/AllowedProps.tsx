import * as React from 'react';

import cx from 'classnames';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

const RefProp = ({id, content, items}: PropsType) => {
  const ref = React.useRef();

  const clazz = cx('foo', {bar: content === 'bar'});

  return (
    <>
      <div className={clazz} ref={ref}>
        click me
      </div>
    </>
  );
};

export default React.memo<PropsType>(RefProp);

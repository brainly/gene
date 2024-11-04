import * as React from 'react';

const CmpsList = ({cmps}) => {
  const items = cmps.map(() => <div />);

  return (
    <div>
      {items}
      {cmps.map(() => (
        <div />
      ))}
    </div>
  );
};

export default React.memo(CmpsList);

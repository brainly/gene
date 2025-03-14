import React from 'react';

const CmpsList = ({cmps}) => (
  <>
    {cmps.map(() => (
      <div />
    ))}
  </>
);

export default React.memo(CmpsList);

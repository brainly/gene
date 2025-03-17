import React from 'react';

type PropsType = Readonly<{
  firstName?: string;
  lastName?: string;
  booleanExample?: boolean;
}>;

const someVal = [];

const ValidConditionalRender = ({ firstName, lastName }: PropsType) => {
  return (
    <div>
      <div>{firstName}</div>
      <div>
        {firstName && someVal.length ? <div>{firstName}</div> : 'No First Name'}
      </div>
      <div>{lastName ? lastName : 'No last name'}</div>
    </div>
  );
};

export default React.memo<PropsType>(ValidConditionalRender);

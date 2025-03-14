import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

function FunctionDeclaration({id, content, items}: PropsType) {
  return null;
}

export default React.memo<PropsType>(FunctionDeclaration);

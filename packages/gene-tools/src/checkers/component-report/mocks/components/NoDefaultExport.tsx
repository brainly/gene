import React from 'react';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
}>;

export const NoDefaultExport = ({id, content, items}: PropsType) => {
  return null;
};

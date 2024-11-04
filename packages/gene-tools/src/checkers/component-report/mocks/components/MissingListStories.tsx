import * as React from 'react';

type PropsType = Readonly<{
  text?: string;
  list: string[];
  second?: string[];
}>;

const MissingListStories = ({list, second}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(MissingListStories);

import React from 'react';

type PropsType = Readonly<{
  text?: string;
  list: string[];
  second?: Array<string>;
  third?: Array<number> | null | undefined;
  fourth?: ReadonlyArray<string>;
}>;

const ValidListStories = ({ list, second, third }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(ValidListStories);

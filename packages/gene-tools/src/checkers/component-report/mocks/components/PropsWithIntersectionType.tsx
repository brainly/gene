import React from 'react';
import { TestIntersectionType } from '../types/TestTypes';

type OneType = Readonly<{
  id: string;
}>;

type TwoType = Readonly<{
  content: string;
}>;

type PropsType = Readonly<{
  values: number[];
}> &
  OneType &
  TwoType &
  TestIntersectionType;

const PropsWithIntersectionType = ({ id, content, foo, values }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithIntersectionType);

import * as React from 'react';
import {TestLiteralType, TestIntersectionType} from '../types/TestTypes';

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
  TestIntersectionType &
  TestLiteralType;

const PropsWithLiteralIntersectionType = ({
  id,
  content,
  foo,
  values,
  bar,
}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithLiteralIntersectionType);

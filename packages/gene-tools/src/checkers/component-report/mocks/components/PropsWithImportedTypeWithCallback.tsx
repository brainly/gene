import React from 'react';
import {TestIntersectionTypeWithCallback} from '../types/TestTypes';

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
  TestIntersectionTypeWithCallback;

const PropsWithImportedTypeWithCallback = ({
  id,
  content,
  values,
}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithImportedTypeWithCallback);

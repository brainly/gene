import React from 'react';
import { TestImportedInterface } from '../types/TestTypes';

type OneType = Readonly<{
  id: string;
}>;

type TwoType = Readonly<{
  content: string;
}>;

interface TestInterface {
  dudu: number;
}

type PropsType = Readonly<{
  values: number[];
}> &
  OneType &
  TwoType &
  TestImportedInterface &
  TestInterface;

const PropsWithInterfaceExtension = ({
  id,
  content,
  values,
  dudu,
  foo,
  nana,
  zuzu,
}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithInterfaceExtension);

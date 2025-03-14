import React from 'react';
import {TestInvalidImportedInterface} from '../types/TestTypes';

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
  TestInvalidImportedInterface &
  TestInterface;

const PropsWithInvalidInterfaceExtension = ({
  id,
  content,
  values,
}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithInvalidInterfaceExtension);

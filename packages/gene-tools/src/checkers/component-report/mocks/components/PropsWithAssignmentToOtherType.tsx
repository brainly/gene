import React from 'react';
import { TestImportedInterface } from '../types/TestTypes';

type OneType = TestImportedInterface;

type TwoType = OneType;

type PropsType = TwoType;

const PropsWithInterfaceExtension = ({ foo }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithInterfaceExtension);

import React from 'react';
import { TestImportedInterface } from '../types/TestTypes';

type PropsType = TestImportedInterface;

const PropsWithAssignmentToInterface = ({ zuzu }: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithAssignmentToInterface);

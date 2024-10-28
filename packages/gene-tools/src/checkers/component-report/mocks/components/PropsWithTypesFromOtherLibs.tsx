import * as React from 'react';
import {TestIntersectionType} from '../types/TestTypes';
import {SomeType} from '@acme/some-types';

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
  SomeType;

const PropsWithTypesFromOtherLibs = ({id, content, values}: PropsType) => {
  return null;
};

export default React.memo<PropsType>(PropsWithTypesFromOtherLibs);

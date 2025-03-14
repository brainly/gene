import React from 'react';
import { compose } from 'ramda';

type PropsType = Readonly<{
  id: string;
  content: string;
  items: Array<unknown>;
  children?: React.ReactNode;
}>;

const withLogic = (Component: React.ComponentType<any>) => Component;

const ValidPropsCompose = ({ id, content, items }: PropsType) => {
  return null;
};

export default React.memo(compose(withLogic)(ValidPropsCompose));

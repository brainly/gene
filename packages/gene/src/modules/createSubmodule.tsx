import React from 'react';

export function createSubmodule<PropsType extends object>(
  Component: React.ComponentType<PropsType>,
  context: PropsType,
): JSX.Element {
  return <Component {...context} />;
}

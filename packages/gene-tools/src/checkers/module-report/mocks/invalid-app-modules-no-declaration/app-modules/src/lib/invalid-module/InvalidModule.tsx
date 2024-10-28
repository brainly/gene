import * as React from 'react';
import {useModuleInjection} from '@brainly-gene/core';

function useInit() {
  const ref = React.useRef();

  return {ref};
}

const symbolIdent = Symbol.for('injectionExample');

function InvalidModule() {
  const {
    ref,
    someProps,
    useSomeMediators,
    injected,
    injectedSecond
  } = useInit();

  useSomeMediators();

  return (
    <div ref={ref}>
      <div>{JSON.stringify(someProps)}</div>
      <div>{injected}</div>
      <div>{injectedSecond}</div>
    </div>
  );
}

export {InvalidModule};

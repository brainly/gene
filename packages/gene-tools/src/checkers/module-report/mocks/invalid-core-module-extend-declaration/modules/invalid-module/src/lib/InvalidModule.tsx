import React from 'react';
import {extendGeneModule, useModuleInjection} from '@brainly-gene/core';

function useInit() {
  const ref = React.useRef();

  return {ref};
}

const symbolIdent = Symbol.for('injectionExample');

function RawInvalidModule() {
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

const {declarations, module: InvalidModule} = extendGeneModule({
  module: RawInvalidModule,
  declarations: {
    components: [[symbolIdent, 'ExampleComponent']],
    mediators: [['injectionKey', 'ExampleMedaitor']],
  },
});

export {InvalidModule, declarations};

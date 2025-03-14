import React from 'react';
import {createGeneModule, useModuleInjection} from '@brainly-gene/core';
import { useSomeLogic } from './delegates/useSomeLogic';

const symbolIdent = Symbol.for('injectionExample');

function useInit() {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const {someProps, useSomeMediators} = useSomeLogic({ref});

  const injected = useModuleInjection(symbolIdent);
  const injectedSecond = useModuleInjection('injectionKey');

  return {
    ref,
    someProps,
    useSomeMediators,
    injected,
    injectedSecond
  };
}

function RawValidVariationModule() {
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

const {declarations, module: ValidVariationModule} = createGeneModule({
  module: RawValidVariationModule,
  declarations: {
    components: [[symbolIdent, 'ExampleComponent']],
    mediators: [['injectionKey', 'ExampleMedaitor']],
  },
});

export {ValidVariationModule, declarations};

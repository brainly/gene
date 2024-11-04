import { Container } from 'inversify';
import {
  MediatorDeclarationsType,
  ComponentDeclarationType,
  EventHandlersType,
} from './types';

type BindModulePropsType = {
  components?: ComponentDeclarationType;
  mediators?: MediatorDeclarationsType;
  eventHandlers?: EventHandlersType;
  parentContainer?: Container;
  containers?: Container[];
};

export function getModuleContainer({
  components = [],
  mediators = [],
  containers = [],
  eventHandlers = [],
  parentContainer,
}: BindModulePropsType): {
  identifiers: Record<string, symbol>;
  container: Container;
} {
  const container = new Container();
  let mergedContainer = container;

  if (parentContainer) {
    mergedContainer = Container.merge(
      parentContainer,
      container,
      ...containers
    ) as Container;
  } else {
    if (containers.length) {
      const [firstContainer, ...restContainers] = containers;

      mergedContainer = Container.merge(
        container,
        firstContainer,
        ...restContainers
      ) as Container;
    }
  }

  const componentsIdentifiers = bind(components, mergedContainer);
  const mediatorsIdentifiers = bind(mediators, mergedContainer);
  const eventHandlersIdentifiers = bind(eventHandlers, mergedContainer);

  return {
    identifiers: {
      ...componentsIdentifiers,
      ...mediatorsIdentifiers,
      ...eventHandlersIdentifiers,
    },
    container: mergedContainer,
  };
}

function bind(
  elements: MediatorDeclarationsType | ComponentDeclarationType,
  container: Container
) {
  const identifiers: Record<string, symbol> = {};

  elements.forEach(([identifier, element]) => {
    try {
      const value = container.get(identifier);

      if (value) {
        container.unbind(identifier);
      }
      // eslint-disable-next-line no-empty
    } catch {}
    container.bind(identifier).toConstantValue(element);

    // watch out: the keys may be different from the ones given on input to createModule/extendModule
    const symbolKey = Symbol.keyFor(identifier);
    if (symbolKey) {
      identifiers[symbolKey] = identifier;
    }
  });

  return identifiers;
}

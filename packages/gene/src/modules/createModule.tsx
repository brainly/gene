import { Container } from 'inversify';
import { getModuleContainer } from './di';
import { DefaultDeclarationsType, ModuleComponentType } from './types';
import { decorateModule } from './decorateModule';

export type ModuleInputType<T, U extends string> = {
  // remove declarations and add mediators and components directly in here
  declarations: DefaultDeclarationsType;
  module: ModuleComponentType<T, U>;
};

export type ModuleReturnType<T, U extends string> = {
  module: ModuleComponentType<T, U>;
  container: Container;
  identifiers: Record<string, symbol>;
  declarations: ModuleInputType<T, U> & {
    container: Container;
    identifiers: Record<string, symbol>;
  };
};

export function createGeneModule<
  RenderChildrenProp = Record<string, any>,
  SlotsLabels extends string = string,
>(
  props: ModuleInputType<RenderChildrenProp, SlotsLabels>,
): ModuleReturnType<RenderChildrenProp, SlotsLabels> {
  const {
    mediators,
    components,
    contextProviders,
    containers,
    eventHandlers,
    errorBoundary,
  } = props.declarations;

  const { identifiers, container } = getModuleContainer({
    components,
    mediators,
    eventHandlers,
    containers,
  });

  return {
    identifiers,
    container,
    declarations: {
      ...props,
      container,
      identifiers,
    },
    module: decorateModule({
      Module: props.module,
      container,
      contexts: contextProviders,
      errorBoundary,
    }),
  };
}

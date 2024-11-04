import { Container } from 'inversify';
import { ModuleInputType } from './createModule';
import { getModuleContainer } from './di';
import { decorateModule } from './decorateModule';
import { ModuleComponentType } from './types';

export function extendGeneModule<RenderChildrenProp = Record<string, any>, SlotsLabels extends string = string>(
  parentDeclarations: ModuleInputType<RenderChildrenProp, SlotsLabels> & {
    identifiers: Record<string, symbol>;
    container: Container;
  },
  moduleDeclarations: Partial<ModuleInputType<RenderChildrenProp, SlotsLabels>>
): ModuleComponentType<RenderChildrenProp> {
  const { container } = getModuleContainer({
    components: moduleDeclarations?.declarations?.components || [],
    mediators: moduleDeclarations?.declarations?.mediators || [],
    eventHandlers: moduleDeclarations?.declarations?.eventHandlers || [],
    containers: moduleDeclarations?.declarations?.containers || [],
    parentContainer: parentDeclarations.container,
  });

  return decorateModule({
    Module: moduleDeclarations.module || parentDeclarations.module,
    container,
    contexts: [
      ...(parentDeclarations.declarations.contextProviders || []),
      ...(moduleDeclarations.declarations?.contextProviders || []),
    ],
    errorBoundary:
      moduleDeclarations.declarations?.errorBoundary ||
      parentDeclarations.declarations?.errorBoundary,
  });
}

export type ActionHandler<
  TMachineContext,
  TMachineEvent,
  TInjectedDependencies,
> = (
  deps: TInjectedDependencies,
  context: TMachineContext,
  event: TMachineEvent,
) => void;

export function createGeneMachineAction<
  TMachineContext,
  TMachineEvent,
  TInjectedDependencies,
>(
  actionFunction: ActionHandler<
    TMachineContext,
    TMachineEvent,
    TInjectedDependencies
  >,
) {
  return (deps: TInjectedDependencies) =>
    (context: TMachineContext, event: TMachineEvent) =>
      actionFunction(deps, context, event);
}

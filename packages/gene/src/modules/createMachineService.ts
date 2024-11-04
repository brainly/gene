export type Handler<
  TMachineContext,
  TMachineEvent,
  TSender,
  TInjectedDependencies
> = (
  deps: TInjectedDependencies,
  context: TMachineContext,
  event: TMachineEvent
) => (send: TSender) => void | (() => void);

export function createGeneMachineService<
  TMachineContext,
  TMachineEvent,
  TSender,
  TInjectedDependencies
>(
  handlerFunction: Handler<
    TMachineContext,
    TMachineEvent,
    TSender,
    TInjectedDependencies
  >
) {
  return (deps: TInjectedDependencies) =>
    (context: TMachineContext, event: TMachineEvent) =>
      handlerFunction(deps, context, event);
}

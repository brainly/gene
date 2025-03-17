import React from 'react';
import { InversifyContext, Provider } from '../ioc';
import { Container, interfaces } from 'inversify';
import { ModuleComponentPropsType, ModuleComponentType } from './types';
import {
  ErrorBoundaryDeclarationType,
  EmptyErrorBoundary,
  ERROR_BOUNDARY_IDENTIFIER,
  ErrorBoundaryComponentType,
} from '../error-boundary';
import {
  ERROR_LOGGING_SERVICE_IDENTIFIER,
  ERROR_WITH_MODULE_BOUNDARY_LOGGING_IDENTIFIER,
  getErrorLoggingFunction,
  ErrorWithModuleBoundaryLoggingFunctionType,
  Message,
} from '../logging';
import { isNonEmptyArray } from '../utils/isNonEmptyArray';

function EmptyContext({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function decorateModule<
  RenderChildrenProps = Record<string, any>,
  SlotsLabels extends string = string,
>({
  Module,
  container,
  contexts = [EmptyContext],
  errorBoundary,
}: {
  Module: ModuleComponentType<RenderChildrenProps, SlotsLabels>;
  container: Container;
  contexts?: React.ComponentType<{ children?: React.ReactNode }>[];
  errorBoundary?: ErrorBoundaryDeclarationType;
}) {
  return ({
    serverProps,
    renderChildren,
    slots,
  }: ModuleComponentPropsType<RenderChildrenProps, SlotsLabels>) => {
    const context = React.useContext(InversifyContext);

    const getContainerWithModuleBoundaryTrackErrorFunction = React.useCallback(
      (currentContainer: Container | interfaces.Container) => {
        const hasLoggerBound = currentContainer.isBound(
          ERROR_LOGGING_SERVICE_IDENTIFIER,
        );
        const logger = hasLoggerBound
          ? currentContainer.get<(message: Message) => unknown | undefined>(
              ERROR_LOGGING_SERVICE_IDENTIFIER,
            )
          : undefined;
        const moduleBoundaryTrackErrorFunction = getErrorLoggingFunction(
          logger,
          errorBoundary?.boundaryName,
        );

        const loggerContainer = new Container();
        loggerContainer
          .bind<ErrorWithModuleBoundaryLoggingFunctionType>(
            ERROR_WITH_MODULE_BOUNDARY_LOGGING_IDENTIFIER,
          )
          .toFunction(moduleBoundaryTrackErrorFunction);
        return loggerContainer;
      },
      [],
    );

    const moduleContainer = React.useMemo(() => {
      const emptyContainer = new Container();
      let targetContainer;

      if (context.container) {
        const mergedContainer = Container.merge(context.container, container);

        mergedContainer.parent = Container.merge(
          context.container.parent || emptyContainer,
          container.parent || emptyContainer,
        );

        targetContainer = mergedContainer;
      } else {
        targetContainer = Container.merge(container, emptyContainer);
      }

      if (
        targetContainer.isBound(ERROR_WITH_MODULE_BOUNDARY_LOGGING_IDENTIFIER)
      ) {
        targetContainer.unbind(ERROR_WITH_MODULE_BOUNDARY_LOGGING_IDENTIFIER);
      }

      const mergedContainer = Container.merge(
        targetContainer,
        getContainerWithModuleBoundaryTrackErrorFunction(targetContainer),
      );
      mergedContainer.parent = targetContainer.parent;

      return mergedContainer;
    }, [context.container, getContainerWithModuleBoundaryTrackErrorFunction]);

    const ContextTree = React.useMemo(() => {
      if (!Array.isArray(contexts) || !isNonEmptyArray(contexts)) {
        return EmptyContext;
      }

      return contexts.reduce((Acc, item, index) => {
        const NextContext = contexts[index + 1];

        if (!NextContext) {
          return Acc;
        }

        return ({ children }) => (
          <Acc>
            <NextContext>{children}</NextContext>
          </Acc>
        );
      }, contexts[0]);
    }, []);

    const ErrorBoundaryComponent = React.useMemo(() => {
      if (!errorBoundary) {
        return EmptyErrorBoundary;
      }

      return moduleContainer.isBound(ERROR_BOUNDARY_IDENTIFIER)
        ? moduleContainer.get<ErrorBoundaryComponentType>(
            ERROR_BOUNDARY_IDENTIFIER,
          )
        : EmptyErrorBoundary;
    }, []);

    return (
      <Provider container={moduleContainer}>
        {errorBoundary ? (
          <ErrorBoundaryComponent
            boundaryName={errorBoundary.boundaryName}
            fallback={errorBoundary.fallback}
          >
            <ContextTree>
              <Module
                serverProps={serverProps}
                renderChildren={renderChildren}
                slots={slots}
              />
            </ContextTree>
          </ErrorBoundaryComponent>
        ) : (
          <ContextTree>
            <Module
              serverProps={serverProps}
              renderChildren={renderChildren}
              slots={slots}
            />
          </ContextTree>
        )}
      </Provider>
    );
  };
}

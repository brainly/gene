import { SentryErrorBoundary } from './sentry';
import { EmptyErrorBoundary } from './empty';
import { Container } from 'inversify';
import type { ErrorBoundaryComponentType } from './types';

export const ERROR_BOUNDARY_IDENTIFIER = Symbol.for('errorBoundary');
export const EMPTY_ERROR_BOUNDARY_IDENTIFIER = Symbol.for('emptyErrorBoundary');
export const SENTRY_ERROR_BOUNDARY_IDENTIFIER = Symbol.for(
  'sentryErrorBoundary',
);

export type ErrorBoundaryType =
  | typeof SENTRY_ERROR_BOUNDARY_IDENTIFIER
  | typeof EMPTY_ERROR_BOUNDARY_IDENTIFIER;

const errorBoundariesComponents = new Map([
  [SENTRY_ERROR_BOUNDARY_IDENTIFIER, SentryErrorBoundary],
  [EMPTY_ERROR_BOUNDARY_IDENTIFIER, EmptyErrorBoundary],
]);

function getErrorBoundary(
  errorBoundary: ErrorBoundaryType,
): ErrorBoundaryComponentType {
  return errorBoundariesComponents.get(errorBoundary) || EmptyErrorBoundary;
}

export function getErrorBoundaryContainer(errorBoundary: ErrorBoundaryType) {
  const errorBoundaryContainer = new Container();

  errorBoundaryContainer
    .bind<ErrorBoundaryComponentType>(ERROR_BOUNDARY_IDENTIFIER)
    .toFunction(getErrorBoundary(errorBoundary));

  return errorBoundaryContainer;
}

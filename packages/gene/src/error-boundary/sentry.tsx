'use client';
import { ErrorBoundary } from '@sentry/react';
import type { ErrorBoundaryPropsType } from './types';

export const SentryErrorBoundary = ({
  children,
  boundaryName,
  fallback,
}: ErrorBoundaryPropsType) => {
  return (
    <ErrorBoundary
      fallback={fallback}
      beforeCapture={(scope) => {
        scope.setTag('boundaryName', boundaryName);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

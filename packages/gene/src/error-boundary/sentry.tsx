'use client';
import * as React from 'react';
import * as Sentry from '@sentry/react';
import { ErrorBoundaryPropsType } from './types';

export const SentryErrorBoundary = ({
  children,
  boundaryName,
  fallback,
}: ErrorBoundaryPropsType) => {
  return (
    <Sentry.ErrorBoundary
      fallback={fallback}
      beforeCapture={(scope) => {
        scope.setTag('boundaryName', boundaryName);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

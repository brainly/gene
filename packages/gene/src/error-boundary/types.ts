import type { JSX } from 'react';

export interface ErrorBoundaryPropsType {
  children: React.ReactNode;
  boundaryName: string;
  fallback?: React.ReactElement<Record<string, unknown>, string>;
}

export type ErrorBoundaryComponentType = (
  props: ErrorBoundaryPropsType
) => JSX.Element;

export type ErrorBoundaryDeclarationType = Omit<
  ErrorBoundaryPropsType,
  'children'
>;

import React from 'react';
import { Container } from 'inversify';
import { ErrorBoundaryDeclarationType } from '../error-boundary';

export type MediatorPropsType<T extends Record<string, unknown>> = T & {
  ref: React.RefObject<HTMLElement | HTMLDivElement | null>;
};

export type MediatorFactory<T extends Record<string, unknown> = any> = (
  props: MediatorPropsType<T>
) => void;

export type EventHandler = (props: unknown) => void;

interface InjectableFactory {
  factory: (props: any) => any;
}

export type MediatorDeclarationsType = [
  symbol,
  MediatorFactory | InjectableFactory
][];
export type ComponentDeclarationType = [
  symbol,
  React.ComponentType<any> | InjectableFactory
][];

export type EventHandlersType = [symbol, EventHandler][];

export interface DefaultDeclarationsType {
  mediators?: MediatorDeclarationsType;
  components?: ComponentDeclarationType;
  contextProviders?: React.ComponentType<{ children?: React.ReactNode }>[];
  containers?: Container[];
  eventHandlers?: EventHandlersType;
  errorBoundary?: ErrorBoundaryDeclarationType;
}

export interface ModuleComponentPropsType<
  T = Record<string, any>,
  U extends string = string
> {
  serverProps?: Record<string, any>;
  renderChildren?: (props: T) => JSX.Element;
  slots?: Record<U, JSX.Element | null>;
}

export type ModuleComponentType<
  RenderChildrenProps = Record<string, any>,
  SlotsLabels extends string = string
> = (
  props: ModuleComponentPropsType<RenderChildrenProps, SlotsLabels>
) => JSX.Element | null;

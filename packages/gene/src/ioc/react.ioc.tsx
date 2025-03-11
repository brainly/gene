'use client';
import React, { PropsWithChildren, useContext, useMemo } from 'react';

import { interfaces } from 'inversify';

export const InversifyContext = React.createContext<{
  container: interfaces.Container | null;
}>({
  container: null,
});

interface Props extends React.PropsWithChildren {
  container: interfaces.Container;
}

export const Provider: React.FC<Props> = (props) => {
  const value = useMemo(
    () => ({ container: props.container }),
    [props.container]
  );

  return (
    <InversifyContext.Provider value={value}>
      {props.children}
    </InversifyContext.Provider>
  );
};

type InjectionType<T> =
  | T
  | {
      factory: () => T;
    };

export function useInjection<T>(identifier: interfaces.ServiceIdentifier<T>) {
  const { container } = useContext(InversifyContext);

  if (!container) {
    throw new Error(
      'DI context not found. Is your component wrapped in <InversifyContext.Provider />?'
    );
  }

  const value = container.get<InjectionType<T>>(identifier);

  if (value && typeof value === 'object' && 'factory' in value) {
    return value.factory() as T;
  }

  return value as T;
}

type ComponentInjectionType<T> =
  | React.ComponentType<T>
  | {
      factory: () => React.ComponentType<T>;
    };

export function useComponentInjection<T>(
  identifier: interfaces.ServiceIdentifier<React.ComponentType<T>>,
  fallback: React.ComponentType<T>
) {
  const { container } = useContext(InversifyContext);

  if (!container) {
    return fallback;
  }

  try {
    const value = container.get<ComponentInjectionType<T>>(identifier);
    if ('factory' in value) {
      return value.factory() as React.ComponentType<T>;
    }
    return value as React.ComponentType<T>;
  } catch {
    return fallback;
  }
}

type CallbackType<T, R = void> = (props: T) => R;

type CallbackInjectionType<T, R = void> =
  | CallbackType<T, R>
  | {
      factory: () => CallbackType<T, R>;
    };

export function useCallbackInjection<T, R = void>(
  identifier: interfaces.ServiceIdentifier<CallbackType<T, R>>,
  fallback: CallbackType<T, R>
) {
  const { container } = useContext(InversifyContext);

  if (!container) {
    return fallback;
  }

  try {
    const value = container.get<CallbackInjectionType<T, R>>(identifier);
    /**
     * In order to use union we have to check if `factory` exist in value.
     */
    if ('factory' in value) {
      return value.factory() as CallbackType<T, R>;
    }
    return value as CallbackType<T, R>;
  } catch {
    return fallback;
  }
}

export function withIoc<Props extends Record<string, any>>(
  getContainer: (props?: Props) => interfaces.Container
) {
  return (Page: React.ComponentType<Props>) => {
    return (props: Props) => {
      const container = getContainer(props);

      return (
        <Provider container={container}>
          <Page {...props} />
        </Provider>
      );
    };
  };
}

import React from 'react';
import type { Router } from '@brainly-gene/core';
import {
  Provider,
  useMockedRouterContainer,
  getAssetsContainer,
  NATIVE_IMAGE,
  emit,
  EventBusContextProvider,
  register,
} from '@brainly-gene/core';

import styles from './StorybookProviders.module.scss';
import { Container, type interfaces } from 'inversify';

import type { AppStoreType, ReducerType } from '../../ioc';
import { useAppContextContainer, useServiceClientsContainer } from '../../ioc';
import type { Locale } from '@brainly-gene/next';
import { LinkRewriteContextProvider } from '@brainly-gene/next';
type OverwritableContainerKeys = 'adsContainer';

export interface StorybookProvidersPropsType {
  children: React.ReactNode;
  additionalContainers?: interfaces.Container[];
  overwriteContainers?: Partial<
    Record<OverwritableContainerKeys, Container | undefined>
  >;
  routingOptions?: Partial<Router>;
  initialAppContext?: AppStoreType;
  appContextReducer?: ReducerType;
  locale?: Locale;
}

export function StorybookProviders({
  children,
  additionalContainers = [],
  routingOptions,
  initialAppContext = {},
  appContextReducer,
}: StorybookProvidersPropsType) {
  const serviceClientsContainer = useServiceClientsContainer();
  const routerContainer = useMockedRouterContainer(routingOptions);

  const { Provider: AppContextProvider, container: appContextContainer } =
    useAppContextContainer(initialAppContext, appContextReducer);
  const mockedAssetsContainer = getAssetsContainer(NATIVE_IMAGE);

  const storybookContainer = Container.merge(
    serviceClientsContainer,
    routerContainer,
    appContextContainer,
    mockedAssetsContainer,
    ...additionalContainers,
  );

  return (
    <EventBusContextProvider value={{ emit, register }}>
      <Provider container={storybookContainer}>
        <LinkRewriteContextProvider
          rewrites={[]}
          redirects={[]}
          originUrl={window.location.origin}
        >
          <AppContextProvider>
            <div className={styles.moduleWrapper}>{children}</div>
          </AppContextProvider>
        </LinkRewriteContextProvider>
      </Provider>
    </EventBusContextProvider>
  );
}

export default StorybookProviders;

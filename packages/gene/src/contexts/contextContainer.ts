import { Container } from 'inversify';

import type { ActionType, AppContextType } from './appContext';
import { APP_CONTEXT_IDENTIFIER } from './appContext';
import { makeStore } from './makeStore';

export type AppStoreType = Record<string, unknown>;

export type AppReducerType = (
  state: AppStoreType,
  action: ActionType,
) => AppStoreType;

const defaultAppReducer: AppReducerType = (
  state: AppStoreType,
  action: ActionType,
) => {
  switch (action.type) {
    default:
      return { ...state, ...action.value };
  }
};

export const useAppContextContainer = (
  appInitialState: AppStoreType,
  appReducer?: AppReducerType,
) => {
  const [Provider, useDispatch, useStore] = makeStore<AppStoreType, ActionType>(
    {
      ...appInitialState,
    },
    appReducer || defaultAppReducer,
  );

  const container = new Container();
  container
    .bind<AppContextType<AppStoreType>>(APP_CONTEXT_IDENTIFIER)
    .toConstantValue({
      useDispatch,
      useStore,
    });

  return {
    Provider,
    container,
  };
};

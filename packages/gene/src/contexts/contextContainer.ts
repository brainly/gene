import { Container } from 'inversify';

import {
  APP_CONTEXT_IDENTIFIER,
  ActionType,
  AppContextType,
} from './appContext';
import { makeStore } from './makeStore';

export type AppStoreType = Record<string, unknown>;

export type AppReducerType = (
  state: AppStoreType,
  action: ActionType
) => AppStoreType;

const defaultAppReducer: AppReducerType = (
  state: AppStoreType,
  action: ActionType
) => {
  switch (action.type) {
    default:
      return { ...state, ...action.value };
  }
};

export const useAppContextContainer = <T>(
  appInitialState: AppStoreType,
  appReducer?: AppReducerType
) => {
  const [Provider, getDispatch, getStore] = makeStore<AppStoreType, ActionType>(
    {
      ...appInitialState,
    },
    appReducer || defaultAppReducer
  );

  const container = new Container();
  container
    .bind<AppContextType<AppStoreType>>(APP_CONTEXT_IDENTIFIER)
    .toConstantValue({
      getDispatch,
      getStore,
    });

  return {
    Provider,
    container,
  };
};

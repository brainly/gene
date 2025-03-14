import {Container} from 'inversify';
import {
  AppContextType,
  APP_CONTEXT_IDENTIFIER,
ActionType, makeStore} from '@brainly-gene/core';




export type AppStoreType = Partial<{
  test: string;
}>;

export type ReducerType = (
  state: AppStoreType,
  action: ActionType
) => AppStoreType;

const defaultAppReducer: ReducerType = (
  state: AppStoreType,
  action: ActionType
) => {
  switch (action.type) {
    default:
      return {...state, ...action.value};
  }
};

const defaultAppInitialState = {
 
};

export const useAppContextContainer = (
  appInitialState: AppStoreType,
  appReducer?: ReducerType
) => {
  const [Provider, useDispatch, useStore] = makeStore<AppStoreType, ActionType>(
    {
      ...defaultAppInitialState,
      ...appInitialState,
    },
    appReducer || defaultAppReducer
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

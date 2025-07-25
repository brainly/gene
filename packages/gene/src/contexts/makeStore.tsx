import type { JSX } from 'react';
import React, { createContext, useContext, useReducer } from 'react';

export type DispatchType<A> = (action: A) => void;
export type ReducerType<S, A> = (state: S, action: A) => S;
type PropsType<S> = {
  children?: React.ReactNode;
  initialState?: Partial<S>;
};

export function makeStore<S, A>(
  initialState: S,
  reducer: ReducerType<S, A>
): [(props: PropsType<S>) => JSX.Element, () => DispatchType<A>, () => S] {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const dispatchContext = createContext((action: A) => {});
  const storeContext = createContext<S>(initialState);

  const StoreProvider = ({
    children,
    initialState: propsInitialState,
  }: PropsType<S>) => {
    const [store, dispatch] = useReducer(reducer, {
      ...initialState,
      ...propsInitialState,
    });

    return (
      <dispatchContext.Provider value={dispatch}>
        <storeContext.Provider value={store}>{children}</storeContext.Provider>
      </dispatchContext.Provider>
    );
  };

  function useDispatch() {
    return useContext(dispatchContext);
  }

  function useStore() {
    return useContext(storeContext);
  }

  return [StoreProvider, useDispatch, useStore];
}

import React from 'react';

export type ActionType = {
  type: string;
  value?: Record<string, unknown>;
};

export const APP_CONTEXT_IDENTIFIER = Symbol.for('appContext');

export type AppContextType<T, A = undefined> = {
  getDispatch: () => React.Dispatch<A extends undefined ? ActionType : A>;
  getStore: () => T;
};

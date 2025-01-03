import React from 'react';

export interface ActionType {
  type: string;
  value?: Record<string, unknown>;
}

export const APP_CONTEXT_IDENTIFIER = Symbol.for('appContext');

export interface AppContextType<S, A = undefined> {
  dispatchContext: React.Context<
    (action: A extends undefined ? ActionType : A) => void
  >;
  storeContext: React.Context<S>;
}

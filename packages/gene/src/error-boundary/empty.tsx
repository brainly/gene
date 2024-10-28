import {ErrorBoundaryPropsType} from './types';

export const EmptyErrorBoundary = ({children}: ErrorBoundaryPropsType) => {
  return children as JSX.Element;
};

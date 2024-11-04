import React, {SyntheticEvent} from 'react';
import {useTransformedNextRouter} from '../routers';

export interface Routable {
  onError?: (err: {cancelled: boolean; url: string; type?: string}) => void;
  guard?: (url?: string) => boolean;
  requiresLeaveConfirmation?: boolean;
  url: string;
  as?: string;
  onClick?: (e?: SyntheticEvent) => void;
  prefetch?: boolean;
}

function getDisplayName<T>(WrappedComponent: React.FC<T>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function withRouter<T extends Routable>(Component: React.FC<T>) {
  function ViewComponent(props: T) {
    const newProps: T = {...props};

    const {navigate, generate} = useTransformedNextRouter();

    function onClick(e: SyntheticEvent) {
      if (!newProps.guard?.(newProps.url)) {
        return;
      }
      if (
        newProps.requiresLeaveConfirmation &&
        !window.confirm('Are you sure you want to leave?')
      ) {
        return;
      }
      // preserve the old behavior
      if (props.onClick) {
        props.onClick(e);
      }
      navigate(generate(props.url));
    }

    return <Component {...newProps} onClick={onClick} />;
  }
  // The only reason we return ViewComponent is so we can set display name
  // To my knowledge we can't do this with an anonymous function
  ViewComponent.displayName = `withRouter(${getDisplayName(Component)})`;
  return ViewComponent;
}

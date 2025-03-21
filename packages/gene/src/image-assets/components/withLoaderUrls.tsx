import React from 'react';
import { useInjection } from '../../ioc';
import { APP_CONTEXT_IDENTIFIER, AppContextType } from '../../contexts';
interface WithOriginURLProps {
  originURL: string;
  imgproxyLoaderBaseUrl: string;
}

export const withLoaderUrls = <P extends object>(
  WrappedComponent: React.FC<P & WithOriginURLProps>,
): React.FC<P> => {
  return (props: P) => {
    const { useStore } = useInjection<
      AppContextType<{
        originUrl: URL;
        imgproxyLoaderBaseUrl: string;
      }>
    >(APP_CONTEXT_IDENTIFIER);

    const { originUrl, imgproxyLoaderBaseUrl } = useStore();

    return (
      <WrappedComponent
        {...(props as P)}
        originURL={originUrl?.origin}
        imgproxyLoaderBaseUrl={imgproxyLoaderBaseUrl}
      />
    );
  };
};

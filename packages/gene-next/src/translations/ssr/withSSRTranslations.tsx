import React from 'react';
import {useSSR} from 'react-i18next';
import {SSRStore} from '../i18n';

export function withSSRTranslations<T>(
  language: string = process.env.NEXT_PUBLIC_BUILD_LANG || 'en-US'
) {
  return (Page: React.ComponentType<T>) => {
    return (props: T & {pageProps: Record<string, any>}) => {
      const translations = props.pageProps.translations;
      const serverTranslations = React.useMemo(() => {
        if (translations) {
          // side-effect to update singleton SSR translations store
          SSRStore.current = translations.common;

          return translations;
        }

        return {
          language,
          common: {},
        };
      }, [translations]);

      useSSR(
        {
          [serverTranslations.language]: {
            common: serverTranslations.common,
          },
        },
        language
      );

      return <Page {...props} />;
    };
  };
}

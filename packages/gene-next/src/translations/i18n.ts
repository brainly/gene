import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const i18nConfig = {
  react: {
    useSuspense: false, //   <---- required for NextJS, must migrate to https://github.com/isaachinman/next-i18next
  },
  fallbackLng: process.env.NEXT_PUBLIC_BUILD_LANG || 'en-US',
  load: 'currentOnly',
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react!!
    prefix: '%',
    suffix: '%',
  },
  defaultNS: 'common',
  detection: {
    order: ['querystring', 'htmlTag', 'navigator'],
  },
  backend: {
    // this is temporary to load only empty file as lib required to load file
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loadPath: () => `/nx-locales/empty.json`,
    requestOptions: {
      cache: 'force-cache',
    },
  },
};

export function initI18n() {
  i18n // load translation using xhr -> see /public/nx-locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(HttpApi) // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector) // pass the i18n instance to react-i18next.
    .use(initReactI18next) // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .init(i18nConfig);
}

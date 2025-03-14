import { useTranslation as useReacti18Translation } from 'react-i18next';
import i18n from 'i18next';
import type { TranslationParamsType, TranslationServiceType } from '../types';
import { transChoiceHelper as transChoiceHelperFn } from '../utils/transChoiceHelper';
import { useMemo } from 'react';
import { ssrFallback } from '../ssr/ssrFallback';

export function useTranslation(): TranslationServiceType {
  const { t } = useReacti18Translation();
  const locale = i18n.language;

  return useMemo(() => {
    const translate = (
      key: string,
      params?: TranslationParamsType,
      transChoiceHelper?: { basedOnParam: number },
    ) => {
      if (
        transChoiceHelper &&
        typeof transChoiceHelper.basedOnParam === 'number'
      ) {
        return transChoiceHelperFn({
          translationKey: key,
          translator: {
            trans: t,
          },
          params,
          number: transChoiceHelper.basedOnParam,
          locale,
        });
      }

      const value = t(key, params);
      if (typeof window === 'undefined') {
        let fallback = ssrFallback(key);
        Object.entries(params || {}).forEach(([key, value]) => {
          const regex = new RegExp(`%${key}%`, 'g');
          fallback = fallback.replace(regex, String(value));
        });

        return fallback;
      }

      return value;
    };

    return {
      translate,
      locale,
    };
  }, [locale, t]);
}

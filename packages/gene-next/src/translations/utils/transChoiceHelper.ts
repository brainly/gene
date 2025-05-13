import type { TranslationParamsType } from '../types';

/**
 * @description
 * Translations in our DB are set up to support plurals and singulars by indexes
 * at the end of the key
 * @example
 "achievements_badge_description_best_answers_0":"Przyznaliśmy odznakę za %counter% najlepszą odpowiedź.",
 "achievements_badge_description_best_answers_1":"Przyznaliśmy odznakę za %counter% najlepsze odpowiedzi.",
 "achievements_badge_description_best_answers_2":"Przyznaliśmy odznakę za %counter% najlepszych odpowiedzi.",
 *
 * transChoiceHelper function will modify given key with proper index based on given number.
 */

export interface TransChoiceHelperFnType {
  translator: {
    trans: (
      string: string,
      translationVariables?: TranslationParamsType,
    ) => string;
  };
  translationKey: string;
  number?: number;
  locale?: string;
  params?: TranslationParamsType;
}

export function transChoiceHelper({
  translationKey,
  translator,
  number,
  params,
  locale,
}: TransChoiceHelperFnType) {
  let valueByLocale;

  if (typeof number === 'number') {
    switch (locale) {
      case 'en':
      case 'en-US':
      case 'en_US':
      case 'en-GB':
      case 'en_GB':
      case 'es-ES':
      case 'es_ES':
      case 'fr':
      case 'pt-BR':
      case 'pt_BR':
        valueByLocale = number === 1 ? null : 'plural';
        break;

      case 'id':
        valueByLocale = 0;
        break;

      case 'ru':
      case 'uk':
        if (number % 10 === 1 && number % 100 !== 11) {
          valueByLocale = 0;
        } else if (
          number % 10 >= 2 &&
          number % 10 <= 4 &&
          (number % 100 < 10 || number % 100 >= 20)
        ) {
          valueByLocale = 1;
        } else {
          valueByLocale = 2;
        }

        break;

      case 'pl':
        if (number === 1) {
          valueByLocale = 0;
        } else if (
          number % 10 >= 2 &&
          number % 10 <= 4 &&
          (number % 100 < 12 || number % 100 > 14)
        ) {
          valueByLocale = 1;
        } else {
          valueByLocale = 2;
        }

        break;

      case 'ro':
        if (number === 1) {
          valueByLocale = 0;
        } else if (number === 0 || (number % 100 > 0 && number % 100 < 20)) {
          valueByLocale = 1;
        } else {
          valueByLocale = 2;
        }

        break;
      default:
        valueByLocale = null;
    }
  }

  const mutatedTranslationKey =
    typeof valueByLocale === 'number' || typeof valueByLocale === 'string'
      ? `${translationKey}_${valueByLocale}`
      : translationKey;

  return translator.trans(mutatedTranslationKey, params);
}

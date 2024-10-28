export type TranslateFunctionType = (
  key: string,
  params?: TranslationParamsType,
  transChoiceHelper?: {basedOnParam: number}
) => string;

export type TranslationServiceType = {
  translate: TranslateFunctionType;
  locale: string;
};

export type TranslationParamsType = Record<string, string | number>;

export enum Locale {
  EN = 'en',
  EN_US = 'en_US',
  ES_ES = 'es_ES',
  FR = 'fr',
  ID = 'id',
  PL = 'pl',
  RU = 'ru',
  RO = 'ro',
  TR = 'tr',
  UK = 'uk',
  PT_BR = 'pt_BR',
}

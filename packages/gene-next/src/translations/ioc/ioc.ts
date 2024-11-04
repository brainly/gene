import { Container } from 'inversify';
import { TranslationServiceType } from '../types';
import { useTranslation } from '../translators/react-i18n';


export const TRANSLATION_SERVICE_IDENTIFIER = Symbol.for('translation');
export const REACT_I18_NEXT = Symbol.for('reacti18next');

type TranslatorTypes = typeof REACT_I18_NEXT;

export type TranslationIocType = () => TranslationServiceType;

const translators = new Map([[REACT_I18_NEXT, () => useTranslation()]]);

function getTranslator(
  translator: TranslatorTypes
): () => TranslationServiceType {
  return translators.get(translator) || (() => useTranslation());
}

export function getTranslatorContainer(translator: TranslatorTypes) {
  const brainlyTranslationContainer = new Container();

  brainlyTranslationContainer
    .bind<TranslationIocType>(TRANSLATION_SERVICE_IDENTIFIER)
    .toFunction(getTranslator(translator));

  return brainlyTranslationContainer;
}

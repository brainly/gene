import {TranslationParamsType} from '../types';
import {SSRStore} from '../i18n';

export function ssrFallback(key: string, params?: TranslationParamsType) {
  return SSRStore.current[key] || key;
}

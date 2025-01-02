import { SSRStore } from '../i18n';

export function ssrFallback(key: string) {
  return SSRStore.current[key] || key;
}

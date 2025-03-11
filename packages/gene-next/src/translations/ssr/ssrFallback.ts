import { SSRStore } from './ssrStore';

export function ssrFallback(key: string) {
  return SSRStore.current[key] || key;
}

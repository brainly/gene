import {curry} from 'ramda';

export type Factory<T = any> = (key: string) => (config: ConfigType) => T;

type MapperType = Record<string, (config: ConfigType) => unknown>;
type ConfigType = Record<string, unknown>;

type CurriedFunction = <M extends MapperType>(
  map: M
) => (key: string) => (config: ConfigType) => ReturnType<M[string]>;

export default curry(
  <M extends Record<string, (config: Record<string, unknown>) => unknown>>(
    map: M,
    key: string,
    config: Record<string, unknown>
  ) => {
    const el = map[key] || map['fallback'];

    return el(config) as ReturnType<M[string]>;
  }
) as CurriedFunction;

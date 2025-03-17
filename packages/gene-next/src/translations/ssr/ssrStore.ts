interface SSRStoreType {
  current: Record<string, string>;
}

export const SSRStore: SSRStoreType = { current: {} };

import merge from 'deepmerge';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
export type ApolloClientType = {
  hydrate: (initialState?: NormalizedCacheObject) => void;
  dehydrate: () => unknown;
  dehydrateAndClearStore: () => Promise<unknown>;
  getClient: () => ApolloClient<NormalizedCacheObject>;
};

function isEqual(value: any, other: any): boolean {
  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two values are of different types, they are not equal
  if (type !== Object.prototype.toString.call(other)) {
    return false;
  }

  // If the value is a primitive type, just compare the values
  if (
    [
      '[object Number]',
      '[object String]',
      '[object Boolean]',
      '[object Undefined]',
      '[object Null]',
    ].indexOf(type) >= 0
  ) {
    return value === other;
  }

  // If the value is a date object, compare the date values
  if (type === '[object Date]') {
    return value.getTime() === other.getTime();
  }

  // If the value is an array, compare the array values
  if (type === '[object Array]') {
    if (value.length !== other.length) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i])) {
        return false;
      }
    }
    return true;
  }

  // If the value is an object, compare the object properties
  if (type === '[object Object]') {
    const keys = Object.keys(value);
    if (keys.length !== Object.keys(other).length) {
      return false;
    }
    for (const key of keys) {
      if (!isEqual(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  // If the value is a function, they are equal if the function reference is the same
  if (type === '[object Function]') {
    return value === other;
  }

  // If the value is any other type, they are not equal
  return false;
}

export function apolloFactory(
  getClient: () => ApolloClient<NormalizedCacheObject>
) {
  const client = getClient();

  return {
    hydrate: (initialState?: NormalizedCacheObject) => {
      // If your page has Next.js data fetching methods that use Apollo Client, the initial state
      // gets hydrated here
      if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = client.extract();

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
          // combine arrays using object equality (like in sets)
          arrayMerge: (destinationArray: any[], sourceArray: any[]) => [
            ...sourceArray,
            ...destinationArray.filter((d: any) =>
              sourceArray.every((s: any) => !isEqual(s, d))
            ),
          ],
        });

        // Restore the cache with the merged data
        client.cache.restore(data);
      }
    },
    dehydrate: () => client.cache.extract(),
    // only for memory leak test purposes, if it will work we need to refactor main dehydrate function to that one
    dehydrateAndClearStore: async () => {
      const extractedClient = client.cache.extract();
      // after dehydration clear store and stop apollo client
      await client.clearStore();
      client.stop();
      return extractedClient;
    },
    getClient: () => client,
  };
}

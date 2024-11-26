declare let window: any;

interface ListenableElementType<T> {
  readonly addEventListener?: (
    label: string,
    callback: (event: T) => unknown
  ) => unknown;
  readonly removeEventListener?: (
    label: string,
    callback: (event: T) => unknown
  ) => unknown;
}

// Transform listening for event for Promise, use only for single time listeners
export function promiseFromEvent<
  T = CustomEvent<Record<string, any>>,
  U extends ListenableElementType<T> = ListenableElementType<T>
>(
  eventLabel: string,
  target: U = window,
  filterFn?: (event: T) => boolean
): Promise<T> {
  return new Promise<T>(
    (resolve: (arg0: T) => unknown, reject: (arg0: unknown) => unknown) => {
      try {
        const callback = (event: T) => {
          if (filterFn && !filterFn(event)) {
            return;
          }
          if (target.removeEventListener) {
            target.removeEventListener(eventLabel, callback);
          }
          resolve(event);
        };

        if (!target.addEventListener) {
          return reject(new Error('target.addEventListener is missing'));
        }

        target.addEventListener(eventLabel, callback);

        return;
      } catch (e) {
        reject(e);
        return;
      }
    }
  );
}

export const wait = async (time = 0) =>
  new Promise((resolve) => setTimeout(resolve, time));

export interface ExampleResponse { data: { hello: string }; headers?: Headers }
export interface ExamplePaginatedResponse {
  data: { page: number };
  headers?: Headers;
}

export function mockFetch() {
  const res = { data: { hello: { world: 'value' } } };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(res),
      text: () => Promise.resolve(JSON.stringify(res)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      status: 200,
    })
  );
}
export function mockFetchPaginated() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { page: 1 } }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      status: 200,
    })
  );
}

export function mockFetchWithDelay(delay = 0) {
  const res = { data: { hello: { world: 'value' } } };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resolve({
            ok: true,
            json: () => Promise.resolve(res),
            text: () => Promise.resolve(JSON.stringify(res)),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            status: 200,
          });
        }, delay);
      })
  );
}

export function mockFetchWithError(delay = 0) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn(
    () =>
      new Promise((_, reject) => {
        setTimeout(() => {
          reject({
            data: {
              error: 'Invalid request',
            },
          });
        }, delay);
      })
  );
}

export function mockFetchBasedOnParam() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn((url) => {
    const foo = String(url).split('/').pop();
    const count = parseInt(foo || '0', 10);
    const res = { data: { hello: { world: `value ${count}` } } };
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(res),
      text: () => Promise.resolve(JSON.stringify(res)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      status: 200,
    });
  });
}

export function mockFetchBasedOnQuery() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn((url, {body}) => {
    let res = {};
    console.log(JSON.parse(body).operationName);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (JSON.parse(body).operationName === 'GetSomethingElse') {
      res = { data: { hola: { mundo: 'value' } } };
    } else {
      res = { data: { hello: { world: 'value' } } };
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(res),
      text: () => Promise.resolve(JSON.stringify(res)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      status: 200,
    });
  });
}

export function mockFetchChangingData() {
  let count = 0;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.fetch = jest.fn(() => {
    count++;
    const res = { data: { hello: { world: `value ${count}` } } };
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(res),
      text: () => Promise.resolve(JSON.stringify(res)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      status: 200,
    });
  });
}

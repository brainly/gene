import type {
  InfiniteQueryObserverResult,
  QueryObserverResult} from '@tanstack/react-query';
import {
  InfiniteQueryObserver,
  QueryObserver
} from '@tanstack/react-query';

import {
  createPaginatedTestObservable,
  createTestObservable,
} from './test-utils';

import type {
  ExampleResponse} from '../services';
import {
  mockFetch,
  wait,
  mockFetchPaginated,
} from '../services';

describe('getReactQueryObservable', () => {
  beforeAll(() => {
    mockFetch();
  });
  it('creates React Query Observable correctly and fetches proper data', async () => {
    const $reactQueryObservable = createTestObservable();
    const values: unknown[] = [];
    $reactQueryObservable.subscribe((value) => values.push(value));

    expect($reactQueryObservable instanceof QueryObserver).toBe(true);

    /**
     * Waiting for observer updates
     */
    await wait();

    const value = values[1] as QueryObserverResult<ExampleResponse>;

    expect(value.isLoading).toBe(false);
    expect(value.data).toMatchObject({ data: { hello: { world: 'value' } } });
  });

  it('creates React Query Observable correctly and catches error from response', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
    const $reactQueryObservable = createTestObservable();
    const values: unknown[] = [];
    $reactQueryObservable.subscribe((value) => values.push(value));

    /**
     * Waiting for observer updates
     */
    await wait();

    const firstValue = values[0] as QueryObserverResult<ExampleResponse>;
    const secondValue = values[1] as QueryObserverResult<ExampleResponse>;

    expect(firstValue.isLoading).toBe(true);
    expect(firstValue.data).toBe(undefined);

    expect(secondValue.isError).toBe(true);
    expect(secondValue.status).toBe('error');
  });
});

describe('getReactQueryPaginatedObservable', () => {
  beforeAll(() => {
    mockFetchPaginated();
  });
  it('creates React Query Paginated Observable correctly and fetches proper data', async () => {
    const $reactQueryObservable = createPaginatedTestObservable();
    const values: unknown[] = [];
    $reactQueryObservable.subscribe((value) => values.push(value));

    expect($reactQueryObservable instanceof InfiniteQueryObserver).toBe(true);

    /**
     * Waiting for observer updates
     */
    await wait();

    const value = values[1] as InfiniteQueryObserverResult<ExampleResponse>;

    expect(value.data).toMatchObject({
      pages: [{ data: { page: 1 } }],
      pageParams: [1],
    });
  });
});

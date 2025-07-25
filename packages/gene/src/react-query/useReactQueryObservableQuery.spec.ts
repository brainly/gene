import { act, renderHook, waitFor } from '@testing-library/react';

import { useReactQueryObservableQuery } from './useReactQueryObservableQuery';
import type { QueryObserver } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

import { createTestObservable } from './test-utils';
import type { ExampleResponse } from '../services';
import {
  mockFetch,
  mockFetchBasedOnParam,
  mockFetchChangingData,
} from '../services';

let client: QueryClient;

const useTestQuery = (variables: { foo: number }) => {
  const $reactQueryObservable = createTestObservable({ ...variables }, client);
  return useReactQueryObservableQuery<ExampleResponse>($reactQueryObservable);
};

describe('useReactQueryObservableQuery', () => {
  beforeEach(() => {
    client = new QueryClient();
  });

  it('returns proper data on re-render cycle', async () => {
    mockFetch();
    const $reactQueryObservable =
      createTestObservable() as unknown as QueryObserver<ExampleResponse>;

    const { result, unmount } = renderHook(() =>
      useReactQueryObservableQuery<ExampleResponse>($reactQueryObservable),
    );

    expect(result.current.data).toBe(undefined);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value' } },
    });
    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toEqual(null);
    unmount();
  });

  it('returns new data when variables change', async () => {
    mockFetchBasedOnParam();

    let foo = 0;
    const { result, rerender } = renderHook(() => useTestQuery({ foo }));

    let initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 0' } },
    });
    foo = 1;
    act(() => {
      rerender();
    });
    initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 1' } },
    });

    foo = 2;
    act(() => {
      rerender();
    });
    initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 2' } },
    });

    foo = 3;
    act(() => {
      rerender();
    });
    initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 3' } },
    });
  });

  it('returns new data when using refetch with same variables', async () => {
    mockFetchChangingData();

    const { result, unmount } = renderHook(() => useTestQuery({ foo: 1 }));

    let initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 1' } },
    });

    act(() => {
      result.current.refetch();
    });

    initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 2' } },
    });
    unmount();
  });

  it('returns data from cache if the variable is the same and does not perform network call', async () => {
    mockFetchBasedOnParam();

    const spy = jest.spyOn(global, 'fetch');

    let foo = 1;

    const { result, rerender, unmount } = renderHook(() =>
      useTestQuery({ foo }),
    );

    let initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 1' } },
    });

    foo = 2;
    act(() => {
      rerender();
    });

    initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 2' } },
    });

    foo = 3;
    act(() => {
      rerender();
    });
    initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 3' } },
    });

    foo = 1;
    act(() => {
      rerender();
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 1' } },
    });

    expect(spy).toHaveBeenCalledTimes(3);

    foo = 2;
    act(() => {
      rerender();
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 2' } },
    });

    expect(spy).toHaveBeenCalledTimes(3);

    foo = 3;
    act(() => {
      rerender();
    });

    expect(result.current.data).toMatchObject({
      data: { hello: { world: 'value 3' } },
    });

    expect(spy).toHaveBeenCalledTimes(3);

    console.log({ cache: client.getQueryCache() });

    unmount();
  });
});

import { renderHook, waitFor } from '@testing-library/react';

import { reactQueryFetchWrapper } from './reactQueryFetchWrapper';
import { useReactQueryLazy } from './useReactQueryLazy';
import { QueryClient } from '@tanstack/react-query';
import type { ExampleResponse } from '../services';
import { mockFetch, mockFetchWithDelay, mockFetchWithError } from '../services';

let queryClient: QueryClient;

const queryFn = () =>
  reactQueryFetchWrapper<ExampleResponse>(() => fetch('hello'));
describe('useReactQueryLazy', () => {
  beforeEach(() => {
    mockFetch();
    queryClient = new QueryClient();
  });

  it('returns proper data on re-render cycle', async () => {
    const { result } = renderHook(() =>
      useReactQueryLazy<ExampleResponse>({
        reactQueryClient: queryClient,
        queryFn,
        queryKey: () => ['key'],
      }),
    );

    expect(result.current.data).toBe(undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    result.current.fetch();

    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).toMatchObject({
      data: {
        hello: {
          world: 'value',
        },
      },
    });
    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toEqual(null);
  });

  it('handles optimistic updates correctly', async () => {
    mockFetchWithDelay(500);
    const optimisticResponse = {
      data: {
        hello: 'optimistic',
      },
    };

    const { result } = renderHook(() =>
      useReactQueryLazy<ExampleResponse>({
        reactQueryClient: queryClient,
        queryFn,
        queryKey: () => ['key'],
      }),
    );

    result.current.fetch({ optimisticResponse });

    await waitFor(() => {
      expect(result.current.data).toMatchObject(optimisticResponse);
    });

    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    expect(result.current.data).toMatchObject({
      data: {
        hello: {
          world: 'value',
        },
      },
    });
  });

  it('ignores cache when ignoreCache is true', async () => {
    queryClient.setQueryData(['key'], { hello: 'cached' });

    const { result } = renderHook(() =>
      useReactQueryLazy<ExampleResponse>({
        reactQueryClient: queryClient,
        queryFn,
        queryKey: () => ['key'],
      }),
    );

    result.current.fetch({ ignoreCache: true });

    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    expect(result.current.data).not.toMatchObject({
      hello: 'cached',
    });
    expect(result.current.data).toMatchObject({
      data: {
        hello: {
          world: 'value',
        },
      },
    });
  });

  it('updates other queries based on provided updaters', async () => {
    queryClient.setQueryData(['otherKey'], { value: 'original' });

    const updateFn = (currentData: any) => {
      return { ...currentData, value: 'updated' };
    };

    const { result } = renderHook(() =>
      useReactQueryLazy<ExampleResponse>({
        reactQueryClient: queryClient,
        queryFn,
        queryKey: () => ['key'],
      }),
    );

    result.current.fetch({ updates: [{ queryKey: ['otherKey'], updateFn }] });

    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    const updatedData = queryClient.getQueryData(['otherKey']);
    expect(updatedData).toMatchObject({ value: 'updated' });
  });

  it('does not update if query key does not exist', async () => {
    const updateFn = (currentData: any) => {
      return { ...currentData, value: 'updated' };
    };

    const { result } = renderHook(() =>
      useReactQueryLazy<ExampleResponse>({
        reactQueryClient: queryClient,
        queryFn,
        queryKey: () => ['key'],
      }),
    );

    result.current.fetch({ updates: [{ queryKey: ['otherKey'], updateFn }] });

    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });

    const updatedData = queryClient.getQueryData(['otherKey']);
    expect(updatedData).toBe(undefined);
  });

  it('handles errors and reverts other queries updates', async () => {
    mockFetchWithError(500);

    queryClient.setQueryData(['otherKey'], { value: 'original' });

    const updateFn = (currentData: any) => {
      return { ...currentData, value: 'should revert' };
    };

    const optimisticResponse = {
      data: {
        hello: 'optimistic',
      },
    };

    const { result } = renderHook(() =>
      useReactQueryLazy<ExampleResponse>({
        reactQueryClient: queryClient,
        queryFn,
        queryKey: () => ['key'],
      }),
    );

    try {
      await waitFor(() => {
        result.current.fetch({
          updates: [{ queryKey: ['otherKey'], updateFn }],
          optimisticResponse,
        });

        const updatedData = queryClient.getQueryData(['otherKey']);
        expect(updatedData).toMatchObject({ value: 'should revert' });
      });
    } catch {
      const revertedData = queryClient.getQueryData(['otherKey']);
      expect(revertedData).toMatchObject({ value: 'original' });
    }
  });

  it('refetches provided queries after the main query succeeds', async () => {
    const refetchSpy = jest.spyOn(queryClient, 'refetchQueries');

    const { result } = renderHook(() =>
      useReactQueryLazy<ExampleResponse>({
        reactQueryClient: queryClient,
        queryFn,
        queryKey: () => ['key'],
      }),
    );

    await waitFor(() =>
      result.current.fetch({ refetchQueries: [['anotherKey']] }),
    );

    expect(refetchSpy).toHaveBeenCalledWith({ queryKey: ['anotherKey'] });
  });
});

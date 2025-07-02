import React from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
import {
  useEventBusBehaviourSubscription,
  EventBusContextProvider,
  useEventBusSubscription,
} from './useEventBus';
import { emit, register } from './EventBus';

const wrapper = ({ children }: any) => (
  <EventBusContextProvider value={{ emit, register }}>
    {children}
  </EventBusContextProvider>
);

describe('useEventBusBehaviourSubscription', () => {
  it('creates subscription and re-render with value on event emit', async () => {
    const props = {
      eventName: 'test-event',
    };
    const { result } = renderHook(
      () => useEventBusBehaviourSubscription(props),
      {
        wrapper,
      }
    );

    expect(result.current).toBe(undefined);

    act(() => {
      emit({
        type: 'test-event',
        payload: 'value',
      });
    });

    await waitFor(() => {
      expect(result.current).toBe('value');
    });
  });

  it('creates subscription and return initial value in first render', async () => {
    const props = {
      eventName: 'test-event',
      initialValue: 'test-value',
    };
    const { result } = renderHook(
      () => useEventBusBehaviourSubscription<string>(props),
      {
        wrapper,
      }
    );

    expect(result.current).toBe('test-value');

    act(() => {
      emit({
        type: 'test-event',
        payload: 'value',
      });
    });

    await waitFor(() => {
      expect(result.current).toBe('value');
    });
  });

  it('returns error when hook is used without context', async () => {
    const props = {
      eventName: 'test-event',
      initialValue: 'test-value',
    };
    const { result } = renderHook(() =>
      useEventBusBehaviourSubscription<string>(props)
    );

    expect(result.current).toEqual({
      error: 'EventBus context is not defined!',
    });
  });
});

describe('useEventBusSubscription', () => {
  it('creates subscription and fire handler on event emit', async () => {
    const mockHandler = jest.fn((payload) => payload);
    const { result } = renderHook(
      () => useEventBusSubscription<string>('test-event', mockHandler),
      {
        wrapper,
      }
    );

    expect(result.current).toBe(undefined);

    act(() => {
      emit({
        type: 'test-event',
        payload: 'value',
      });
    });

    await waitFor(() => {
      expect(result.current).toBe(undefined);
      expect(mockHandler).toHaveBeenCalledWith('value');
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  it('returns error when hook is used without context', async () => {
    console.error = jest.fn();
    const { result } = renderHook(() =>
      useEventBusSubscription<string>('test-event', () => null)
    );

    expect(result.current).toEqual(undefined);
    expect(console.error).toHaveBeenCalledWith(
      'EventBus context is not defined!'
    );
  });
});

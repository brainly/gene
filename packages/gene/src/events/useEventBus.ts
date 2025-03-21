'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { AbstractEventBusEventType, register, emit } from './EventBus';
interface PropsType<T> {
  eventName: string;
  initialValue?: T;
}

interface EventBusContextType {
  emit: typeof emit;
  register: typeof register;
}

const eventBusContext = createContext<EventBusContextType | null>(null);

export const EventBusContextProvider = eventBusContext.Provider;

export function useEventBusBehaviourSubscription<T = unknown>({
  eventName,
  initialValue,
}: PropsType<T>) {
  const context: EventBusContextType | null = useContext(eventBusContext);
  const [currentValue, setCurrentValue] = useState<T | undefined>(initialValue);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (context && context.register) {
      const subscription = (
        context.register as (
          event: AbstractEventBusEventType,
          onNext: (value: AbstractEventBusEventType) => void
        ) => ZenObservable.Subscription
      )(
        {
          type: eventName,
        },
        (value: AbstractEventBusEventType) =>
          setCurrentValue(value.payload as T)
      );

      return () => subscription.unsubscribe();
    } else {
      setError('EventBus context is not defined!');
    }
    return () => null;
  }, [context, eventName, setCurrentValue]);

  if (error) {
    return { error };
  }

  return currentValue;
}

export function useEventBusSubscription<T = Record<string, any>>(
  eventName: string,
  handler: (payload: T | undefined) => void
) {
  const context: EventBusContextType | null = useContext(eventBusContext);

  useEffect(() => {
    if (context && (context as EventBusContextType).register) {
      const subscription = (
        context.register as (
          event: AbstractEventBusEventType,
          onNext: (value: AbstractEventBusEventType) => void
        ) => ZenObservable.Subscription
      )(
        {
          type: eventName,
        },
        (value: AbstractEventBusEventType) => {
          if (typeof handler === 'function') {
            handler(value?.payload as T);
          } else {
            console.error(
              `EventBus handler for event: ${eventName} is not defined!`
            );
          }
        }
      );

      return () => subscription.unsubscribe();
    } else {
      console.error('EventBus context is not defined!');
    }
    return () => null;
  }, [context, eventName, handler]);
}

export function useEventBusEmit() {
  const context: EventBusContextType | null = useContext(eventBusContext);

  if (context && context.emit) {
    return context.emit;
  }

  return () => null;
}

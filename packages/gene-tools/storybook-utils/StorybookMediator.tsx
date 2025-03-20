import { action } from '@storybook/addon-actions';
import { useRef, useEffect } from 'react';

type EventsListType = {
  value: string;
  description: string;
};

type PropsType = {
  children: React.ReactNode;
  events: Array<EventsListType | Array<EventsListType>>;
};

function flatEventsArray(
  events: Array<EventsListType | Array<EventsListType>>
): any {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return events.flat();
}

export function StorybookMediator({ events, children }: PropsType) {
  const ref = useRef<HTMLDivElement>(null);

  const flatArrayEvents: Array<EventsListType> = flatEventsArray(events);

  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) return;

    flatArrayEvents.forEach((event) => {
      if (currentRef !== undefined) {
        currentRef.addEventListener(event.value, action(event.value));
      }
    });
    return () => {
      flatArrayEvents.forEach((event) =>
        currentRef.removeEventListener(event.value, action(event.value))
      );
    };
    // disable eslint next line to only once add listener when ref will appear
  }, [ref]);

  return <div ref={ref}>{children}</div>;
}

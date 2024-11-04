export function dispatch<T extends [string, Record<string, unknown>?]>(
  target: EventTarget | null,
  event: T
) {
  const [eventType, eventPayload] = event;

  if (!target) {
    console.warn(
      'No specified target for bubble event, no possibility to dispatch!'
    );
    return;
  }

  target.dispatchEvent(
    new CustomEvent(eventType, {
      detail: eventPayload,
      cancelable: true,
      bubbles: true,
    })
  );
}

import type { Message } from './types';

export function baseLog(message: Message, logFunction = console.log) {
  logFunction(
    `Type: ${message.type}`,
    '\n',
    `Severity: ${message.severity}`,
    '\n',
    `Message: ${
      typeof message.message.error === 'string'
        ? message.message.error
        : message.message.error.stack
    }`,
  );
}

export function baseErrorLog(message: Message) {
  baseLog(message, console.error);
}

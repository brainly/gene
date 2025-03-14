import {Container} from 'inversify';
import type {
  LogType,
  Message,
  ErrorWithModuleBoundaryLoggingFunctionType,
  LoggerFunction} from './types';
import {
  Severity,
  LogLevel
} from './types';
import {baseErrorLog} from "./loggers";

export const ERROR_LOGGING_SERVICE_IDENTIFIER = Symbol.for('errorLogging');

export const ERROR_WITH_MODULE_BOUNDARY_LOGGING_IDENTIFIER = Symbol.for(
  'errorWithModuleBoundaryLogging'
);

export function getErrorLoggingContainer(log: LoggerFunction) {
  const container = new Container();

  container.bind<LogType>(ERROR_LOGGING_SERVICE_IDENTIFIER).toFunction(log);

  return container;
}

export const getErrorLoggingFunction = (
  logger: LoggerFunction = baseErrorLog,
  errorBoundaryName?: string
): ErrorWithModuleBoundaryLoggingFunctionType => {
  return (e: Message | Error | string) => {
    const message: Message =
      e instanceof Error || typeof e === 'string'
        ? ({
          message: {
            error: new Error(e instanceof Error ? e.message : e),
          },
          severity: Severity.HIGH,
          type: LogLevel.ERROR,
        } as Message)
        : e;

    const messageWithBoundaryName: Message = {
      ...message,
      message: {
        ...message.message,
        options: {
          ...message.message.options,
          tags: {
            ...message.message.options?.tags,
            ...(errorBoundaryName && {boundaryName: errorBoundaryName}),
          },
        },
      },
    };

    logger(messageWithBoundaryName);
  };
};

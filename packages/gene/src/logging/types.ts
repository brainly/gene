type Options<T> = Readonly<Record<string, T>>;
type ErrorMessageOptions = Options<Options<string>>;

export type ErrorMessage = Readonly<{
  error: Error | string;
  options?: ErrorMessageOptions;
}>;

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
}

export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  LOW = 'low',
}

export interface Message {
  type: LogLevel;
  severity: Severity;
  message: ErrorMessage;
}

export type LogType = (message: Message) => void;

export type ErrorWithModuleBoundaryLoggingFunctionType = (
  e: Message | Error | string
) => void;

export type LoggerFunction = (message: Message) => void;

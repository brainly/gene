import type { ErrorMessage, LogLevel, Severity } from '@brainly-gene/core';

export type SentryErrorMessage = ErrorMessage &
  Readonly<{
    options?: {
      tags?: Record<string, string>;
      extras?: Record<string, string>;
    };
  }>;

export interface SentryMessage {
  type: LogLevel;
  severity: Severity;
  message: SentryErrorMessage;
}

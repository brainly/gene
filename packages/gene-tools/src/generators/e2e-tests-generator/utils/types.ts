export interface Message {
  role: string;
  content: string;
}

export interface QueryResult {
  steps?: string[];
  messages: Message[];
  response: string;
}

export type AipQueryFunction = (messages: Message[]) => Promise<QueryResult>;

export interface Context {
  status: number;
  error?: string;
  requestId?: string;
  result?: QueryResult;
  stack?: string[];
  retries?: number;
}

export type Message = {role: string; content: string};

export interface QueryResult {
  steps?: Array<string>;
  messages: Message[];
  response: string;
}

export type AipQueryFunction = (messages: Message[]) => Promise<QueryResult>;

export type Context = {
  status: number;
  error?: string;
  requestId?: string;
  result?: QueryResult;
  stack?: string[];
  retries?: number;
};

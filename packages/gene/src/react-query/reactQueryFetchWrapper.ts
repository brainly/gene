import type {Response as NodeResponse} from 'node-fetch';

export async function reactQueryFetchWrapper<TResponse = unknown>(
  queryFn: () => Promise<Response | NodeResponse>
): Promise<TResponse> {
  const response = await queryFn();

  const data = await getJSON(response);

  if (!response.ok) {
    throw new ResponseError(response.statusText, response.status, data);
  }

  return data;
}

export class ResponseError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

// inspired by https://github.com/ajaishankar/openapi-typescript-fetch/blob/main/src/fetcher.ts
async function getJSON(response: Response | NodeResponse) {
  const contentType = response.headers.get('content-type');
  if ([204, 205].includes(response.status) /* no content */) {
    return undefined;
  }
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return await response.json();
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

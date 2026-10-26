import { ServiceUnavailableError, UnauthenticatedError } from '../application/errors/application-errors';

/** Error HTTP crudo. Solo infraestructura lo ve; nunca llega a la pantalla. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
  }
}

export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

interface Options {
  baseUrl: string;
  getToken: () => string | null;
  fetchFn?: typeof fetch;
}


export function createHttpClient({ baseUrl, getToken, fetchFn = (...args) => fetch(...args) }: Options): HttpClient {
  const request = async (method: string, path: string, body?: unknown): Promise<unknown> => {
    const token = getToken();
    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}${path}`, {
        method,
        headers: {
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (cause) {
      throw new ServiceUnavailableError(cause);
    }

    const text = await response.text();
    const data = text ? safeJson(text) : undefined;

    if (response.status === 401) throw new UnauthenticatedError();
    if (response.status >= 500) throw new ServiceUnavailableError(new HttpError(response.status, data));
    if (!response.ok) throw new HttpError(response.status, data);
    return data;
  };

  return {
    get: <T>(path: string) => request('GET', path) as Promise<T>,
    post: <T>(path: string, body: unknown) => request('POST', path, body) as Promise<T>,
    delete: async (path: string) => {
      await request('DELETE', path);
    },
  };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

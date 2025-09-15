import type { AsyncState } from "../model/async-state";
import { SERVER_ERROR_STR } from "../types/error-codes";
import type { SyncState } from "../model/sync-state";

export function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const headers = new Headers(options.headers);

  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  return Promise.race([
    fetch(url, { ...options, headers }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new TypeError('Request timed out')), timeoutMs)
    ),
  ]);
}

export async function extractJsonOrThrow(res: Response) {
    if (!res.ok) {
        const json = await res.json();
        throw {
          status: res.status,
          message: json.message ?? 'Server error',
          type: SERVER_ERROR_STR
        } as App.Error;
    }
    return await res.json();
}

export function isAppError(error: unknown): error is App.Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error && typeof (error as any).message === 'string' &&
    'status' in error && typeof (error as any).status === 'number' &&
    'type' in error && typeof (error as any).type === 'string'
  );
}

export const asyncLoading: AsyncState<any> = {
    loading: true,
    data: null,
    error: null
};

export function asyncSuccess<T>(data: T): AsyncState<T> {
    return {
        loading: false,
        data: data,
        error: null
    };
}

export function asyncError(error: any): AsyncState<any> {
    return {
        loading: false,
        data: null,
        error: error
    };
}

export function syncSuccess<T>(data: T): SyncState<T> {
    return { data, error: null } as SyncState<T>;
}

export function syncError<T>(error: App.Error): SyncState<T> {
    return { data: null, error } as SyncState<T>
}
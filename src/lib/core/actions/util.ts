import type { AsyncState } from "../model/async-state";
import { SERVER_ERROR_STR } from "../types/error-codes";
import type { SyncState } from "../model/sync-state";
import { currentUserStore } from "../store/currentUserStore";
import { get } from "svelte/store";

export function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000, applyAuthHeaders=true): Promise<Response> {
  const headers = new Headers(options.headers);
    
  if (!headers.has("Authorization")) {
    const user = get(currentUserStore);
    if (user.data !== null) {
      headers.set("Authorization", `Bearer ${user.data.accessToken}`);
    }
  }

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

export async function extractJsonOrThrow(res: Response): Promise<any> {
  console.log(res);
  const isBodyExpected = res.status !== 204 && res.headers.get('Content-Length') !== '0';
    if (!res.ok) {
      console.log("RES NOT OK");
      const json = isBodyExpected ? await res.json() : ""; // "".message will default to "Erro interno desconhecido" due to the nullish coalescing
      throw {
        status: res.status,
        message: json.message ?? 'Erro interno desconhecido',
        type: SERVER_ERROR_STR
      } as App.Error;
    }
    if (!isBodyExpected) return null;
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
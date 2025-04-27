import type { ErrorResponse } from "./errorResponse"

export type AsyncState<T> = {
    loading: boolean;
    error: ErrorResponse | null;
    data: T | null;
};

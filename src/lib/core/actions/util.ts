import type { AsyncState } from "../types/asyncState";
import type { ErrorResponse } from "../types/errorResponse";

export function handleResponse(res: Response) {
    if (!res.ok) {
        return res.json().then((data) => {
            throw {
                status: res.status,
                json: data
            } as ErrorResponse;
        });
    }
    return res.json();
}

export const loadingState: AsyncState<any> = {
    loading: true,
    data: null,
    error: null
};

export function successState<T>(data: T): AsyncState<T> {
    return {
        loading: false,
        data: data,
        error: null
    };
}

export function errorState(error: any): AsyncState<any> {
    return {
        loading: false,
        data: null,
        error: error
    };
}
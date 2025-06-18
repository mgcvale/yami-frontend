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
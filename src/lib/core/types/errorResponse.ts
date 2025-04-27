export interface ErrorResponse {
    status: number,
    json: any
};

export function isErrorResponse(obj: any): obj is ErrorResponse {
    return (
        typeof obj === "object" &&
        typeof obj.status === "number" &&
        typeof obj.json === "object"
    );
}
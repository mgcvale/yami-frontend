import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async(event: PageLoadEvent) => {
    const token: string = event.url.searchParams.get("token") ?? "";

    if (token === "") {
        throw error(DEFAULT_ERRORS.INVALID_PAGE_PARAMS.status, DEFAULT_ERRORS.INVALID_PAGE_PARAMS);
    }

    const username: string = event.url.searchParams.get("username") ?? "";
    if (username === "") {
        throw error(DEFAULT_ERRORS.INVALID_PAGE_PARAMS.status, DEFAULT_ERRORS.INVALID_PAGE_PARAMS);
    }

    return {token, username};
}
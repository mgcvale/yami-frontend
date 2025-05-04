import { goto } from "$app/navigation";
import config from "$lib/config";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import Cookies from 'js-cookie';
import { HandleAllGeneric } from "../genericErrorHandler";
import { currentUserStore } from "$lib/core/store/currentUserStore";

export function validateInputs(bio: string, location: string): [string, string, boolean] {
    if (bio.length > 128) {
        return ["The bio must be at most 128 characters long", "", false];
    }
    if (location.length > 128) {
        return ["", "The location must be at most 128 characters long", false];
    }
    return ["", "", true];
}

export function finishAccount(bio: string, location: string): void {
    fetch(config.apiPaths.user(), {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get('accessToken')}`
        },
        body: JSON.stringify({
            bio: bio,
            location: location
        }),
    }).then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw {
                    status: response.status,
                    json: errorData,
                } as ErrorResponse;
            });
        }
        return response.json();
    }).then((data) => {
        console.log("Finish account data: ", data);
        currentUserStore.set({
            loading: false,
            error: null,
            data: data,
        });
        goto('/app');
    }).catch((error: ErrorResponse) => {
        HandleAllGeneric(error);
    });
}
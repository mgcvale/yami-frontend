import { goto } from "$app/navigation";
import config from "$lib/config";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import Cookies from 'js-cookie';
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { HandleAllGeneric } from "../genericErrorHandler";


export function validateInputs(username: string, email: string, password: string): [string, string, string, boolean] {
    if (username.length === 0) {
        return ["You must provide a username", "", "", false];
    }

    if (username.length < 3) {
        return ["The username must be at least 3 characters long", "", "", false];
    }
    
    if (username.length > 31) {
        return ["The username must be at most 32 characters long", "", "", false];
    }
    
    if (email.length === 0) {
        return ["", "You must provide an email", "", false]
    }
    
    if (!email.match(config.emailRegex)) {
        return ["", "You must provide a valid email", "", false]
    }
    
    if (password.length === 0) {
        return ["", "", "You must provide a password", false];
    }

    if (password.length < 8) {
        return ["", "", "Your password must have at least 8 characters", false];
    }

    return ["", "" , "", true];
}

export async function createAccount(username: string, email: string, password: string): Promise<[string, string, string]> {
    let retval: [string, string, string] = ["", "", ""];
    await fetch(config.apiPaths.user(), {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email
        }),
    }).then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw {
                    status: response.status,
                    json: errorData
                } as ErrorResponse;
            });
        }
        return response.json();
    }).then((data) => {
        Cookies.set('accessToken', data.accessToken, { expires: 180 });
        currentUserStore.set({
            loading: false,
            data: {
                id: data.id,
                username: data.username,
                accessToken: data.accessToken,
                email: data.email,
                bio: "",
                location: "",
                followerCount: data.followerCount,
                followingCount: data.followingCount,
                reviewCount: data.reviewCount,
            },
            error: null
        });
        goto("/account/details");
    }).catch((error: ErrorResponse) => {
        if (error.status == 409) {
            console.log("status was 409")
            retval = ["This username is already in use", "", ""];
            return;
        }
        HandleAllGeneric(error);
    });
    return retval;
}
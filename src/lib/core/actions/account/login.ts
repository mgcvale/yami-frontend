import { goto } from "$app/navigation";
import config from "$lib/config";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { HandleAllGeneric } from "../genericErrorHandler";
import Cookies from 'js-cookie';

export function validateInputs(usernameOrEmail: string, password: string): [string, string, boolean] {
    if (usernameOrEmail.length === 0) {
        return ["The username/email can't be empty", "", false];
    }
    if (password.length === 0) {
        return ["", "The password can't be empty", false];
    }
    return ["", "", true];
}

export async function login(usernameOrEmail: string, password: string): Promise<[string]> {
    const jsonData = {
        [usernameOrEmail.match(config.emailRegex) ? 'email' : 'username']: usernameOrEmail,
        password,
    };

    let retval = [""];

    await fetch(config.apiPaths.login(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
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
        Cookies.set('accessToken', data.accessToken);
        currentUserStore.set({
            id: data.id,
            username: data.username,
            email: data.email,
            accessToken: data.accessToken,
            bio: data.bio,
            location: data.location
        });
        goto('/app');
    }).catch((error: ErrorResponse) => {
        console.log("handling error");
        if (error.status === 401) {
            console.log("handling 401");
            retval[0] = "You have entered invalid credentials. Check your password and try again";
            return;
        }
        HandleAllGeneric(error);
    });

    return [retval[0]];
}
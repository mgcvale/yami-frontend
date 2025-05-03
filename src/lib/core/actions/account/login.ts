import { goto } from "$app/navigation";
import config from "$lib/config";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { writable, type Writable } from "svelte/store";
import Cookies from 'js-cookie';
import type { AsyncState } from "$lib/core/types/asyncState";
import type CurrentUser from "$lib/core/model/currentUser";

export const loginResponse: Writable<AsyncState<null>> = writable({
    data: null,
    loading: true,
    error: null
});

export function validateInputs(usernameOrEmail: string, password: string): [string, string, boolean] {
    if (usernameOrEmail.length === 0) {
        return ["The username/email can't be empty", "", false];
    }
    if (password.length === 0) {
        return ["", "The password can't be empty", false];
    }
    return ["", "", true];
}

export function login(usernameOrEmail: string, password: string): void {
    loginResponse.set({
        loading: true,
        data: null,
        error: null
    });
    const jsonData = {
        [usernameOrEmail.match(config.emailRegex) ? 'email' : 'username']: usernameOrEmail,
        password,
    };

    fetch(config.apiPaths.login(), {
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
        Cookies.set('accessToken', data.accessToken, { expires: 180 });
        const user: CurrentUser = {
            id: data.id,
            username: data.username,
            email: data.email,
            accessToken: data.accessToken,
            bio: data.bio,
            location: data.location,
            followerCount: data.followerCount,
            followingCount: data.followingCount,
            reviewCount: data.reviewCount,
        }
        currentUserStore.set({
            data: user,
            loading: false,
            error: null
        });
        localStorage.setItem("currentUser", JSON.stringify(user));
        loginResponse.set({
            loading: false,
            error: null,
            data: null,
        });
        goto('/app');
    }).catch((error) => {
        loginResponse.set({
            error: error,
            data: null,
            loading: false,
        });
    });
}
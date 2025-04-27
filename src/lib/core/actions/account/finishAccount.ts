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

export async function finishAccount(bio: string, location: string): Promise<[string, string]> {
    let retval = ["", ""];

    await fetch(config.apiPaths.user(), {
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
        currentUserStore.set({
            username: data.username,
            email: data.email,
            id: data.id,
            accessToken: data.accessToken,
            bio: data.bio,
            location: data.location,
            followerCount: data.followerCount,
            followingCount: data.followingCount,
            reviewCount: data.reviewCount,
        });
        goto('/app');
    }).catch((error: ErrorResponse) => {
        HandleAllGeneric(error);
    });

    return [retval[0], retval[1]];
}
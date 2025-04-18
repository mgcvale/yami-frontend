import config from "$lib/config";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import Cookies from 'js-cookie';

export async function load() {
    const accessToken = Cookies.get('accessToken');
    if (accessToken == null) {
        return;
    }

    await fetch(config.apiPaths.login(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
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
            id: data.id,
            username: data.username,
            email: data.email,
            accessToken: data.accessToken,
            bio: data.bio,
            location: data.location
        });
    }).catch((error: ErrorResponse) => {
        console.log(error);
    });
    
}
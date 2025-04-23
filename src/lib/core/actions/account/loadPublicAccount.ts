import config from "$lib/config";
import type PublicUser from "$lib/core/model/publicUser";
import type { ErrorResponse } from "$lib/core/types/errorResponse";

export async function loadPublicUser(userid: number): PublicUser | ErrorResponse {
    let user: PublicUser | ErrorResponse = {status: 500, json: ''};

    await fetch(config.apiPaths.user(userid), {
        method: 'GET',
    }).then(response => {
        if (!response.ok) {
            return response.json().then((data) => {
                throw {
                    status: response.status,
                    json: data
                } as ErrorResponse;
            });
        }
        return response.json();
    }).then((data) => {
        user = {
            username: data.username,
            id: data.id,
            bio: data.bio,
            location: data.location,
            followerCount: data.followerCount,
            followingCount: data.followingCount,
            reviewCount: data.reviewCount,
        }
    }).catch((error: ErrorResponse) => {
        user = error;
    });
}
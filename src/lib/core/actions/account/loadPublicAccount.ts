import config from "$lib/config";
import type PublicUser from "$lib/core/model/publicUser";
import type { AsyncState } from "$lib/core/types/asyncState";
import { writable, type Writable } from "svelte/store";

export const loadPublicAccountStore: Writable<AsyncState<PublicUser>> = writable({
    loading: true,
    error: null,
    data: null
});

export function loadPublicUser(userid: number): void {
    
    fetch(config.apiPaths.user(userid))
    .then(async res => {
        if (!res.ok) {
            const data = await res.json();
            throw { status: res.status, json: data };
        }
        return res.json();
    })
    .then(json => {
        loadPublicAccountStore.set({
            loading: false,
            error: null,
            data: {
                username: json.username,
                id: json.id,
                bio: json.bio,
                location: json.location,
                followerCount: json.followerCount,
                followingCount: json.followingCount,
                reviewCount: json.reviewCount,
            }
        });
    })
    .catch(error => {
        loadPublicAccountStore.set({
            loading: false,
            error: error,
            data: null
        });
    });
}
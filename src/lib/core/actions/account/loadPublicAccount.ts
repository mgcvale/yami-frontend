import config from "$lib/config";
import type PublicUser from "$lib/core/model/publicUser";
import type { AsyncState } from "$lib/core/types/asyncState";
import { get, writable, type Writable } from "svelte/store";
import { fetchWithTimeout } from '$lib/core/util/util';
import { currentUserStore } from "$lib/core/store/currentUserStore";

export const loadPublicAccountStore: Writable<AsyncState<PublicUser>> = writable({
    loading: true,
    error: null,
    data: null
});

export function loadPublicUser(userid: number): void {
    const accessToken = get(currentUserStore).data?.accessToken;

    const headers: Record<string, string> = {};
    
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    
    fetchWithTimeout(config.apiPaths.user(userid), {
      headers,
    }, config.fetchTimeout)
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => {
                throw { 
                    status: res.status,
                    json: data
                };
            });
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
                following: json.following,
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
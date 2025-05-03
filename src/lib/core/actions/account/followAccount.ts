import config from "$lib/config";
import type CurrentUser from "$lib/core/model/currentUser";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { AsyncState } from "$lib/core/types/asyncState";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { fetchWithTimeout } from "$lib/core/util/util";
import { get, writable, type Writable } from "svelte/store";

export const followAccountStore: Writable<AsyncState<null>> = writable({
    loading: false,
    data: null,
    error: null
})

export function follow(userid: number) {
    const userStore: AsyncState<CurrentUser> = get(currentUserStore);
    if (get(currentUserStore).loading) return;

    followAccountStore.set({
        loading: true,
        data: null,
        error: null
    });
    if (userStore.data === null) {
        followAccountStore.set({
            loading: false,
            data: null,
            error: {
                status: 401,
                json: ""
            }
        });
        return;
    }

    fetchWithTimeout(config.apiPaths.follow(userid), {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${get(currentUserStore)?.data?.accessToken}`
        }
    }, config.fetchTimeout)
    .then(res => {
        if (!res.ok) {
            return res.json().then(json => {
                throw {
                    status: res.status,
                    json: json
                } as ErrorResponse;
            });
        }
        return res.json();
    })
    .then(() => {
        currentUserStore.update(old => {
            if (!old.data) return old
            return {
                ...old,
                data: {
                    ...old.data,
                    followingCount: old.data.followingCount + 1
                }
            };
        });
        followAccountStore.set({
            loading: false,
            error: null,
            data: null
        });
    })
    .catch(error => {
        followAccountStore.set({
            loading: false,
            error: error,
            data: null
        });
    });
}

export function unfollow(userid: number) {
    const userStore: AsyncState<CurrentUser> = get(currentUserStore);
    if (get(currentUserStore).loading) return;
    

    followAccountStore.set({
        loading: true,
        data: null,
        error: null
    });
    if (userStore.data === null) {
        followAccountStore.set({
            loading: false,
            data: null,
            error: {
                status: 401,
                json: ""
            }
        });
        return;
    }


    fetchWithTimeout(config.apiPaths.follow(userid), {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${get(currentUserStore)?.data?.accessToken}`
        }
    }, config.fetchTimeout)
    .then(res => {
        if (!res.ok) {
            return res.json().then(json => {
                throw {
                    status: res.status,
                    json: json
                } as ErrorResponse;
            });
        }
        return res.json();
    })
    .then(() => {
        currentUserStore.update(old => {
            if (!old.data) return old
            return {
                ...old,
                data: {
                    ...old.data,
                    followingCount: old.data.followingCount - 1
                }
            };
        });
        followAccountStore.set({
            loading: false,
            error: null,
            data: null
        });
    })
    .catch(error => {
        followAccountStore.set({
            loading: false,
            error: error,
            data: null
        });
    });
}
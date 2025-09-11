import config from "$lib/config";
import type PublicUser from "$lib/core/model/publicUser";
import type { AsyncState } from "$lib/core/types/asyncState";
import { get, writable, type Writable } from "svelte/store";
import { fetchWithTimeout } from '$lib/core/util/util';
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { errorState, handleResponse, successState } from "../util";

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
    .then(handleResponse)
    .then(json => loadPublicAccountStore.set(successState(json)))
    .catch(error =>loadPublicAccountStore.set(errorState(error)));
}
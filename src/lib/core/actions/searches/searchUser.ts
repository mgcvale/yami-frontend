import config from "$lib/config";
import type { PageableEntry } from "$lib/core/model/pageableEntry";
import type PublicUser from "$lib/core/model/publicUser";
import type { AsyncState } from "$lib/core/types/asyncState";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { fetchWithTimeout } from "$lib/core/util/util";
import { SearchCheck } from "@lucide/svelte";
import { writable, type Writable } from "svelte/store";

export const searchUserStore: Writable<AsyncState<PageableEntry<PublicUser>>> = writable({
    loading: false,
    data: null,
    error: null
});

export function searchUsers(searchQuery: string): void {
    // start by only doing simple search, gotta wrap this in an if block afterwards
    searchUserStore.set({
        loading: true,
        data: null,
        error: null
    });
    fetchWithTimeout(config.apiPaths.searchUser(searchQuery), {
        
    }, config.fetchTimeout)
    .then(res => {
        if (!res.ok) {
            return res.json().then(json => {
                throw {
                    json: json,
                    status: res.status
                } as ErrorResponse;
            });
        }
        return res.json();
    })
    .then(json => {
        searchUserStore.set({
            loading: false,
            data: json,
            error: null
        });
        console.log(json);
    })
    .catch(error => {
        searchUserStore.set({
            loading: false,
            data: null,
            error: error
        });
    })
}
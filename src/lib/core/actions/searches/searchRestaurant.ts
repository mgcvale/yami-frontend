import config from "$lib/config";
import type { PageableEntry } from "$lib/core/model/pageableEntry";
import type Restaurant from "$lib/core/model/restaurant";
import type { AsyncState } from "$lib/core/types/asyncState";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { fetchWithTimeout } from "$lib/core/util/util";
import { writable, type Writable } from "svelte/store";
import { searchUserStore } from "./searchUser";

export const searchRestaurantStore: Writable<AsyncState<PageableEntry<Restaurant>>> = writable({
    loading: false,
    data: null,
    error: null
});

export function searchRestaurants(searchQuery: string): void {
    searchRestaurantStore.set({
        loading: true,
        data: null,
        error: null
    });

    fetchWithTimeout(config.apiPaths.restaurantSearch(searchQuery), {}, config.fetchTimeout)
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
        searchRestaurantStore.set({
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
    });
}
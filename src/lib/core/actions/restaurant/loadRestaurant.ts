import config from "$lib/config";
import type Restaurant from "$lib/core/model/restaurant";
import type { AsyncState } from "$lib/core/types/asyncState";
import { fetchWithTimeout } from "$lib/core/util/util";
import { writable, type Writable } from "svelte/store";
import { handleResponse } from "../util";

export const loadRestaurantStore: Writable<AsyncState<Restaurant>> = writable({
    loading: true,
    data: null,
    error: null
});

export function loadRestaurant(id: number): void {
    loadRestaurantStore.set({
        loading: true,
        data: null,
        error: null
    });

    fetchWithTimeout(config.apiPaths.restaurant(id), {}, config.fetchTimeout)
    .then(res => {
        return handleResponse(res);
    })
    .then(data => {
        loadRestaurantStore.set({
            loading: false,
            data: data,
            error: null
        });
    })
    .catch(error => {
        loadRestaurantStore.set({
            loading: false,
            data: null,
            error: null
        })
    });
}
import config from "$lib/config";
import type Food from "$lib/core/model/food";
import type { AsyncState } from "$lib/core/types/asyncState"
import { fetchWithTimeout } from "$lib/core/util/util";
import { type Writable, writable } from "svelte/store"
import { handleResponse } from "../util";

export const loadFoodsStore: Writable<AsyncState<Food[]>> = writable({
    loading: true,
    error: null,
    data: null
});

export function loadFoods(restaurantId: number): void {
    loadFoodsStore.set({
        loading: true,
        error: null,
        data: null
    });

    fetchWithTimeout(config.apiPaths.restaurantFoods(restaurantId), {}, config.fetchTimeout)
    .then(res => {
        return handleResponse(res);
    })
    .then(data => {
        loadFoodsStore.set({
            loading: false,
            data: data,
            error: null
        });
    })
    .catch(error => {
        loadFoodsStore.set({
            loading: false,
            error: error,
            data: null
        });
    });

}
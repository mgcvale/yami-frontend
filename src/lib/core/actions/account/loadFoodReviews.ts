import config from "$lib/config";
import type { FoodReview } from "$lib/core/model/foodReview";
import type { PageableEntry } from "$lib/core/model/pageableEntry";
import type { AsyncState } from "$lib/core/types/asyncState";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { fetchWithTimeout } from "$lib/core/util/util";
import { writable, type Writable } from "svelte/store";

export const loadFoodReviewStore: Writable<AsyncState<PageableEntry<FoodReview>>> = writable({
    loading: true,
    data: null,
    error: null
});

export function loadFoodReviews(userId: number): void {
    loadFoodReviewStore.set({
        loading: true,
        data: null,
        error: null
    });

    fetchWithTimeout(config.apiPaths.userReviews(userId), {}, config.fetchTimeout)
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
    .then(data => {
        loadFoodReviewStore.set({
            loading: false,
            error: null,
            data: data as PageableEntry<FoodReview>
        });
    })
    .catch(err => {
       loadFoodReviewStore.set({
        loading: false,
        error: err,
        data: null
       });
    });
}
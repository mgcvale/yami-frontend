import type { FoodReview } from "$lib/core/model/foodReview";
import type { AsyncState } from "$lib/core/types/asyncState";
import { writable, type Writable } from "svelte/store";
import { errorState, handleResponse, loadingState, successState } from "../util";
import { fetchWithTimeout } from "$lib/core/util/util";
import config from "$lib/config";

export const loadRestaurantFoodReviewsStore: Writable<AsyncState<FoodReview>> = writable({
    loading: true,
    data: null,
    error: null
});

export function loadRestaurantFoodReviews(id: number): void {
    loadRestaurantFoodReviewsStore.set(loadingState);

    fetchWithTimeout(config.apiPaths.restaurantReviews(id), {}, config.fetchTimeout)
    .then(handleResponse)
    .then(successState)
    .catch(errorState);
}
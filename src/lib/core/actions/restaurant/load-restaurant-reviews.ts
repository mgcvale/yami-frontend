import { isFoodReview, type FoodReview } from "$lib/core/model/food-review";
import type { AsyncState } from "$lib/core/model/async-state";
import { writable, type Writable } from "svelte/store";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import config from "$lib/config";
import { isArrayOf } from "$lib/core/model/type-checkers";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import type { SyncState } from "$lib/core/model/sync-state";
import { handleAsSyncError } from "../generic-error-handler";

export async function loadRestaurantFoodReviews(id: number): Promise<SyncState<FoodReview[]>> {
    try {
        console.log("LAKJDLAKJDS");
        const response = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.restaurantReviews(id), {}, config.fetchTimeout));
        console.log(response);

        if (!isArrayOf(response, isFoodReview)) {
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }

        return syncSuccess(response);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
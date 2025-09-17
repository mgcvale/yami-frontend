import config from "$lib/config";
import { isFoodReview, type FoodReview } from "$lib/core/model/food-review";
import { isPageableEntry, type PageableEntry } from "$lib/core/model/pageable-entry";
import type { SyncState } from "$lib/core/model/sync-state";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";


export async function loadFoodReviews(id: number): Promise<SyncState<PageableEntry<FoodReview>>> {

    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.foodReviews(id), {method: "GET"}, config.fetchTimeout));

        if (!isPageableEntry(res, isFoodReview)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        return syncSuccess(res as PageableEntry<FoodReview>);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
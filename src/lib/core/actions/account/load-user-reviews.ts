import config from "$lib/config";
import { isFoodReview, type FoodReview } from "$lib/core/model/food-review";
import { isPageableEntry, type PageableEntry } from "$lib/core/model/pageable-entry";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import type { SyncState } from "$lib/core/model/sync-state";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";

export async function loadUserReviews(userId: number): Promise<SyncState<PageableEntry<FoodReview>>> {
    try {
        const data = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.userReviews(userId), {}, config.fetchTimeout));

        if (!isPageableEntry(data, isFoodReview)) {
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }

        return syncSuccess(data);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
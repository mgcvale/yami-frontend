import config from "$lib/config";
import { isFoodReview, type FoodReview } from "$lib/core/model/food-review";
import { isPageableEntry, type PageableEntry } from "$lib/core/model/pageable-entry";
import type { SyncState } from "$lib/core/model/sync-state";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { get } from "svelte/store";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";

export async function loadAllLikedReviews(offset: number = 0): Promise<SyncState<PageableEntry<FoodReview>>> {
    const userStore = get(currentUserStore);

    if (userStore.loading || userStore.data === null) {
        return syncError(DEFAULT_ERRORS.USER_NOT_LOADED);
    }


    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.loadLikedFoodReviews(offset), {
            headers: {
                "Authorization": `Bearer ${userStore.data.accessToken}`
            },
        }, config.fetchTimeout));

        if (!isPageableEntry(res, isFoodReview)) {
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }

        return syncSuccess(res as PageableEntry<FoodReview>);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
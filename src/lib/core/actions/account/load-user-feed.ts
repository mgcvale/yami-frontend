import config from "$lib/config";
import { isFoodReview, type FoodReview } from "$lib/core/model/food-review";
import { isPageableEntry, type PageableEntry } from "$lib/core/model/pageable-entry";
import type { SyncState } from "$lib/core/model/sync-state";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, syncSuccess } from "../util";

export async function loadUserFeed(accessToken: string, page: number = 0): Promise<SyncState<PageableEntry<FoodReview>>> {
    try {
        let response = await extractJsonOrThrow(await fetchWithTimeout(
            config.apiPaths.userFeed(page), 
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            },
            config.fetchTimeout
        ));
        console.log(response);

        if (!isPageableEntry(response, isFoodReview)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        return syncSuccess(response as PageableEntry<FoodReview>);
    } catch (e) {
        return handleAsSyncError(e); // TOOD: case-specific handling
    }
}
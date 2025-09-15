import config from "$lib/config";
import { isPageableEntry, type PageableEntry } from "$lib/core/model/pageable-entry";
import type { Restaurant } from "$lib/core/model/restaurant";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import { isRestaurant } from "$lib/core/model/restaurant";
import type { SyncState } from "$lib/core/model/sync-state";
import { handleAsSyncError } from "../generic-error-handler";

export async function searchRestaurants(searchQuery: string): Promise<SyncState<PageableEntry<Restaurant>>> {

    try {
        const data = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.restaurantSearch(searchQuery), {}, config.fetchTimeout));

        if (!isPageableEntry(data, isRestaurant)) {
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }

        return syncSuccess(data);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
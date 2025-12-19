import config from "$lib/config";
import { isPageableEntry, type PageableEntry } from "$lib/core/model/pageable-entry";
import { isBasicRestaurant, type BasicRestaurant, type Restaurant } from "$lib/core/model/restaurant";
import type { SyncState } from "$lib/core/model/sync-state";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, syncSuccess } from "../util";

export async function loadFollowedRestaurants(offset: number = 0): Promise<SyncState<PageableEntry<BasicRestaurant>>> {
    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.followedRestaurants(offset)));
        if (!isPageableEntry(res, isBasicRestaurant)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        console.log(res.content);

        return syncSuccess(res);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
import config from "$lib/config";
import type { Restaurant } from "$lib/core/model/restaurant";
import { isRestaurant } from "$lib/core/model/restaurant";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import type { SyncState } from "$lib/core/model/sync-state";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import { handleAsSyncError } from "../generic-error-handler";

export async function loadRestaurant(id: number): Promise<SyncState<Restaurant>> {
    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.restaurant(id), {}, config.fetchTimeout));
        console.log(res);
        if (isRestaurant(res)) {
            return syncSuccess(res);
        } else {
            throw (DEFAULT_ERRORS.BAD_RESPONSE);
        }
    } catch (e) {
        return handleAsSyncError(e);
    }
}

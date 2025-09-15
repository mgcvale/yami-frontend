import config from "$lib/config";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import type { SyncState } from "$lib/core/model/sync-state";
import { isArrayOf } from "$lib/core/model/type-checkers";
import { isFood, type Food } from "$lib/core/model/food";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";

export async function loadFoods(restaurantId: number): Promise<SyncState<Food[]>> {

    try {
        const data = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.restaurantFoods(restaurantId), {}, config.fetchTimeout));

        if (!isArrayOf(data, isFood)) {
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }

        return syncSuccess(data);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
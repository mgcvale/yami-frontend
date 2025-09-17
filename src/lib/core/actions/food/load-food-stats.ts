import config from "$lib/config";
import { isRatingDistribution, type RatingDistribution } from "$lib/core/model/rating-distribution";
import type { SyncState } from "$lib/core/model/sync-state";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";

export async function loadFoodStats(foodId: number): Promise<SyncState<RatingDistribution>> {
    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.foodStats(foodId), {"method": "GET"}, config.fetchTimeout));

        if (!isRatingDistribution(res)) {
            console.log(res);
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        return syncSuccess(res as RatingDistribution);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
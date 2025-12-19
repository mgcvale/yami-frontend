import config from "$lib/config";
import { isRestaurant, type Restaurant } from "$lib/core/model/restaurant";
import type { SyncState } from "$lib/core/model/sync-state";
import { isArrayOf } from "$lib/core/model/type-checkers";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, syncSuccess } from "../util";

export async function loadRestaurantReccomendations(accessToken: string): Promise<SyncState<Restaurant[]>> {
    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout( config.apiPaths.restaurantRecommendations(), {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }, config.fetchTimeout));

        console.log(res);

        if (!isArrayOf(res, isRestaurant)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        return syncSuccess(res);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
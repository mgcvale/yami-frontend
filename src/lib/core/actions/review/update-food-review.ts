import { currentUserStore } from "$lib/core/store/currentUserStore"
import { get } from "svelte/store";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import type { SyncState } from "$lib/core/model/sync-state";
import { isFoodReview, type FoodReview } from "$lib/core/model/food-review";
import config from "$lib/config";
import { handleAsSyncError } from "../generic-error-handler";


export async function updateFoodReview(id: number, review: string, rating: number): Promise<SyncState<FoodReview>> {
    const u = get(currentUserStore);
    if (u.data === null) {
        return syncError(DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(
            config.apiPaths.updateFoodReview(id),
            {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${u.data.accessToken}`
                },
                body: JSON.stringify({review, rating})
            },
            config.fetchTimeout
        ));

        if (!isFoodReview(res)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        return syncSuccess(res);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
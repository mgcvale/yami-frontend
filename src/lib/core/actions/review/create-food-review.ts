import config from "$lib/config";
import type { CurrentUser } from "$lib/core/model/current-user";
import type { SyncState } from "$lib/core/model/sync-state";
import { get } from "svelte/store";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { CLIENT_ERROR_STR, CLIENT_ERRORS, DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";
import { isFoodReview, type FoodReview } from "$lib/core/model/food-review";

export async function createFoodReview(foodId: number, review: string, rating: number): Promise<SyncState<FoodReview>> {
    try {
        const currentUser: CurrentUser = get(currentUserStore).data;
        if (!currentUser) throw DEFAULT_ERRORS.USER_NOT_LOADED;

        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.createFoodReview(foodId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser.accessToken}`
            },
            body: JSON.stringify({ review, rating })
        }, config.fetchTimeout));

        if (!isFoodReview(res)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        return syncSuccess(res);
    } catch (e) {
        return translateCreateFoodReviewError(e);
    }
}

function translateCreateFoodReviewError<T>(e: Error): SyncState<T> {
    if (isAppError(e)) {
        switch (e.status) {
            case 409:
                return syncError({
                    status: 409,
                    message: "It seems you already have a review for this food.",
                    type: CLIENT_ERROR_STR
                } as App.Error);
        }
    }
    return handleAsSyncError(e);
}
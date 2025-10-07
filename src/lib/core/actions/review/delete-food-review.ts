import config from "$lib/config";
import type { SyncState } from "$lib/core/model/sync-state";
import { get } from "svelte/store";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import { currentUserStore } from "$lib";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";

export async function deleteFoodReview(reviewId: number): Promise<SyncState<null>> {
    if (get(currentUserStore).data === null) {
        return syncError(DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    try {
        await extractJsonOrThrow(await fetchWithTimeout(
            config.apiPaths.deleteFoodReview(reviewId),
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${get(currentUserStore).data.accessToken}`
                },
            },
            config.fetchTimeout
        ));
        return syncSuccess(null);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
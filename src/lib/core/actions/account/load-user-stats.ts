import config from "$lib/config";
import { isReviewStats, type ReviewStats } from "$lib/core/model/review-stats";
import type { SyncState } from "$lib/core/model/sync-state";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";

export async function loadUserStats(id: number): Promise<SyncState<ReviewStats>> {
    try {
        const data = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.userStats(id), {}, config.fetchTimeout));

        if (!isReviewStats(data)) {
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }

        return syncSuccess(data);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
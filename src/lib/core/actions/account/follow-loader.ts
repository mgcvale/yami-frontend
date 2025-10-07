import config from "$lib/config";
import type { SyncState } from "$lib/core/model/sync-state";
import { extractJsonOrThrow, fetchWithTimeout, syncSuccess } from "../util";
import { isArrayOf } from "$lib/core/model/type-checkers";
import { isPublicUser, isPublicUserWithoutCounts, type PublicUser, type PublicUserWithoutCounts } from "$lib/core/model/public-user";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";

export async function loadFollowers(userid: number): Promise<SyncState<PublicUserWithoutCounts[]>> {
    return loadDynamic(config.apiPaths.userFollowers(userid));
}


export async function loadFollowing(userid: number): Promise<SyncState<PublicUserWithoutCounts[]>> {
    return loadDynamic(config.apiPaths.userFollowing(userid));
}

async function loadDynamic(path: string): Promise<SyncState<PublicUserWithoutCounts[]>> {
    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(path, {}, config.fetchTimeout));
        if (!isArrayOf(res, isPublicUserWithoutCounts)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }
        return syncSuccess(res);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
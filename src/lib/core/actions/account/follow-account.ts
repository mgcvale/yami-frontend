import config from "$lib/config";
import type { CurrentUser } from "$lib/core/model/current-user";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { AsyncState } from "$lib/core/model/async-state";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { get } from "svelte/store";
import type { SyncState } from "$lib/core/model/sync-state";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import { handleAsSyncError } from "../generic-error-handler";

async function requestFollow(userid: number, method: "POST" | "DELETE", delta: number): Promise<SyncState<null>> {
    const userStore = get(currentUserStore);

    if (userStore.loading || userStore.data === null) {
        return syncError(DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    try {
        await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.follow(userid), {
            method: method,
            headers: { "Authorization": `Bearer ${userStore.data.accessToken}` }
        }, config.fetchTimeout));
        
        updateFollowingCount(delta);
    } catch (e) {
        return handleAsSyncError(e);
    }

    return syncSuccess(null);
}

function updateFollowingCount(delta: number): void {
    currentUserStore.update(old => {
        if (!old.data) return old;
        return {
            ...old,
            data: {
                ...old.data,
                followingCount: old.data.followingCount + delta
            }
        };
    });
}

export const follow = (userid: number): Promise<SyncState<null>> => requestFollow(userid, "POST", 1);
export const unfollow = (userid: number): Promise<SyncState<null>> => requestFollow(userid, "DELETE", -1);

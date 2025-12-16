import { currentUserStore } from "$lib/core/store/currentUserStore";
import { get } from "svelte/store";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import type { SyncState } from "$lib/core/model/sync-state";
import config from "$lib/config";
import { handleAsSyncError } from "../generic-error-handler";
import { AppWindow } from "@lucide/svelte";

async function perform(id: number, method: "POST" | "DELETE"): Promise<SyncState<null>> {
    const userStore = get(currentUserStore);

    if (userStore.loading || userStore.data === null) {
        return syncError(DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    try {
        await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.likeFoodReview(id), {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userStore.data.accessToken}`
            }
        }, config.fetchTimeout));
    } catch (e) {
        console.log(e);
        return handleAsSyncError(e);
    }

    return syncSuccess(null);
}

export const doLike = async (id: number): Promise<SyncState<null>> => perform(id, "POST");
export const doUnlike = async (id: number): Promise<SyncState<null>> => perform(id, "DELETE");
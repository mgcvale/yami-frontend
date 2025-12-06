import config from "$lib/config";
import { isCurrentUser, type CurrentUser } from "$lib/core/model/current-user";
import type { SyncState } from "$lib/core/model/sync-state";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { get } from "svelte/store";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";
import { invalidate } from "$app/navigation";


export async function updateAccount(username: string | null, bio: string, location: string): Promise<SyncState<null>> {

    if (get(currentUserStore).data === null) {
        return syncError(DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    try {
        const headers = {
            "Authorization": `Bearer ${get(currentUserStore).data.accessToken}`
        }

        const body = {
        bio,
        location,
        ...(username != null ? { username } : {})
        };

        const data = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.user(), {
            method: "PATCH",
            headers: { ...headers },
            body: JSON.stringify(body)
        }, config.fetchTimeout));

        if (!isCurrentUser(data)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }
        
        currentUserStore.set({
            loading: false,
            error: null,
            data: data as CurrentUser
        });
        localStorage.removeItem("currentUser");
        invalidate('user:current');
        return syncSuccess(null);
    } catch (e) {
        return handleAsSyncError(e);
    }
}
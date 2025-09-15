import { goto } from "$app/navigation";
import config from "$lib/config";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import Cookies from 'js-cookie';
import { handleAllGeneric, handleNetwork, handleUnknownException } from "../generic-error-handler";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import { isCurrentUser } from "$lib/core/model/current-user";
import type { SyncState } from "$lib/core/model/sync-state";

export function validateInputs(bio: string, location: string): [string, string, boolean] {
    if (bio.length > 128) {
        return ["The bio must be at most 128 characters long", "", false];
    }
    if (location.length > 128) {
        return ["", "The location must be at most 128 characters long", false];
    }
    return ["", "", true];
}

export async function finishAccount(bio: string, location: string): Promise<SyncState<void>> {
    try {
        const data = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.user(), {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${Cookies.get('accessToken')}`
            },
            body: JSON.stringify({ bio, location })
        }, config.fetchTimeout));

        if (!isCurrentUser(data)) {
            handleAllGeneric(DEFAULT_ERRORS.BAD_RESPONSE);
        }
        currentUserStore.set({
            loading: false,
            error: null,
            data: data,
        });
        return syncSuccess(null);
        goto('/app');
    } catch (e) {
        if (isAppError(e)) {
            handleAllGeneric(e);
            return syncError(e);
        } else if (e instanceof TypeError) {
            handleNetwork(e);
            return syncError(DEFAULT_ERRORS.NETWORK_ERROR)
        } else {
            handleUnknownException(e);
            return syncError(DEFAULT_ERRORS.UNKNOWN(e));
        }
    }
}
import config from "$lib/config";
import type { SyncState } from "$lib/core/model/sync-state";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";

export async function recoverPassword(token: string, password: string): Promise<SyncState<null>> {
    try {
        await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.resetPassword(), {
            method: "POST",
            body: JSON.stringify({password, token})
        }, config.fetchTimeout));
    } catch (e) {
        if (isAppError(e) && e.status === 400) {
            return syncError({
                ...e,
                message: "Your recovery link has expired is invalid. Re-send a recovery e-mail, and try again."
            });
        }
        console.log(e);
        return handleAsSyncError(e);
    }
    return syncSuccess(null);
}
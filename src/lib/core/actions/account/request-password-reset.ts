import config from "$lib/config";
import type { SyncState } from "$lib/core/model/sync-state";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import { handleAsSyncError } from "../generic-error-handler";

export async function requestPasswordReset(email: string): Promise<SyncState<null>> {
    try {
        await extractJsonOrThrow(await fetchWithTimeout(
            config.apiPaths.recoveryRequest(), {
                method: "POST",
                body: JSON.stringify({ email }),
            }, 
            config.longFetchTimeout)
        );
    } catch(e) {
        if (isAppError(e) && e.status == 404) {
            return syncError({
                ...e,
                message: "Um usuário com este e-mail não existe. Verifique que você digitou o e-mail correto."
            } as App.Error);
        }
        console.log(e);
        return handleAsSyncError(e);
    }

    return syncSuccess(null);
}
import config from "$lib/config";
import type { SyncState } from "$lib/core/model/sync-state";
import { handleAsSyncError } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, syncSuccess } from "../util";

async function doFollow(id: number, method: 'POST' | 'DELETE'): Promise<SyncState<null>> {
    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.restaurantFollow(id), { method }));
        return syncSuccess(null);
    } catch (e) {
        return handleAsSyncError(e);
    }
}

export const unfollow = async (id: number) => doFollow(id, 'DELETE');
export const follow = async (id: number) => doFollow(id, 'POST');
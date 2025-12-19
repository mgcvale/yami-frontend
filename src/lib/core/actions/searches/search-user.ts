import config from "$lib/config";
import { isPageableEntry, type PageableEntry } from "$lib/core/model/pageable-entry";
import type { PublicUser } from "$lib/core/model/public-user";
import { extractJsonOrThrow, fetchWithTimeout, syncError, syncSuccess } from "../util";
import type { SyncState } from "$lib/core/model/sync-state";
import { isPublicUser } from "$lib/core/model/public-user";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";

export async function searchUsers(searchQuery: string): Promise<SyncState<PageableEntry<PublicUser>>> {
    // TODO: change if the user is logged in. This is a simple search, but it should be a user-tailored search when they are logged in.
    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.searchUser(searchQuery), {}, config.fetchTimeout, false));
        console.log(res);
        if (isPageableEntry(res, isPublicUser)) {
            return syncSuccess(res);
        } else {
            console.error("Invalid response on searchUser.ts");
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }
    } catch (e) {
        return handleAsSyncError(e);
    }
}
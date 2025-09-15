import config from "$lib/config";
import type { PublicUser } from "$lib/core/model/public-user";
import { get } from "svelte/store";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { extractJsonOrThrow, syncError, syncSuccess, isAppError, fetchWithTimeout } from "../util";
import type { SyncState } from "$lib/core/model/sync-state";
import { isPublicUser } from "$lib/core/model/public-user";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { handleAsSyncError } from "../generic-error-handler";


export async function loadPublicUser(userid: number): Promise<SyncState<PublicUser>> {
    const accessToken = get(currentUserStore).data?.accessToken;
    const headers: Record<string, string> = {};
    
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const data = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.user(userid), { headers }, config.fetchTimeout));
      if (!isPublicUser(data)) {
        return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
      }

      return syncSuccess(data);
    } catch (e) {
      return handleAsSyncError(e);
    }

}
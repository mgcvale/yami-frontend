import config from "$lib/config";
import { isFood, type Food } from "$lib/core/model/food";
import type { SyncState } from "$lib/core/model/sync-state";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { get } from "svelte/store";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import type { CurrentUser } from "$lib/core/model/current-user";

export async function loadFood(foodId: number): Promise<SyncState<Food>> {

    const currentUser: CurrentUser = get(currentUserStore).data;
    let headers = {};
    if (currentUser) {
        headers = {
            "Authorization": `Bearer ${currentUser.accessToken}`
        }
    }

    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.food(foodId), {
            method: 'GET',
            headers
        }, config.fetchTimeout));

        console.log(res);

        if (!isFood(res)) {
            throw DEFAULT_ERRORS.BAD_RESPONSE;
        }

        return syncSuccess(res as Food);
    } catch (e) {
        if (isAppError(e)) {
            return syncError(e);
        } else if (e instanceof TypeError) {
            return syncError(DEFAULT_ERRORS.NETWORK_ERROR);
        }
        return syncError(DEFAULT_ERRORS.UNKNOWN(e));
    }

}
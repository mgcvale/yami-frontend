import type { PageLoad, PageLoadEvent } from "./$types";
import type { PublicUser } from "$lib/core/model/public-user";
import type { SyncState } from "$lib/core/model/sync-state";
import { loadPublicUser } from "$lib/core/actions/account/load-public-account";
import { loadUserStats } from "$lib/core/actions/account/load-user-stats";
import { error } from "@sveltejs/kit";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";

export const load: PageLoad = async (event: PageLoadEvent) => {
    const { parent, depends } = event;
    const { user } = await parent();

    const id: string | null = event.url.searchParams.get('id');

    if (!id && !user) {
        throw error(DEFAULT_ERRORS.USER_NOT_LOADED.status, DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    const userId: number = id ? parseInt(id) : user!.id;
    console.log(userId);
    const viewingSelf = !id || (user && userId === user.id);

    let thisUser: SyncState<PublicUser>;
    if (viewingSelf) {
        thisUser = { data: user as PublicUser, error: null };
    } else {
        thisUser = await loadPublicUser(userId);
    }

    if (thisUser.error) {
        throw error(thisUser.error.status, thisUser.error);
    }

    const stats = await loadUserStats(userId);
    if (stats.error) {
        throw error(stats.error.status, stats.error);
    }

    return { user: thisUser.data, stats: stats.data, userId, viewingSelf };
}
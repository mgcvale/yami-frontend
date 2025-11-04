import { error } from "@sveltejs/kit";
import type { PageLoad, PageLoadEvent } from "./$types";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import type { SyncState } from "$lib/core/model/sync-state";
import type { PageableEntry } from "$lib/core/model/pageable-entry";
import type { FoodReview } from "$lib/core/model/food-review";
import { loadUserFeed } from "$lib/core/actions/account/load-user-feed";
import { goto } from "$app/navigation";

export const load: PageLoad = async (event: PageLoadEvent) => {
    const { parent, depends } = event;
    const { user } = await parent();

    if (!user) {
        goto('/account/login');
        throw error(401, DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    // now we load the user's feed

    let feed: SyncState<PageableEntry<FoodReview>> = await loadUserFeed(user.accessToken, 0);

    if (feed.error) {
        throw error(feed.error.status, feed.error);
    }
    if (!feed.data) {
        throw error(DEFAULT_ERRORS.BAD_RESPONSE.status, DEFAULT_ERRORS.BAD_RESPONSE);
    }

    return { user, feedEntries: feed.data.content };
}
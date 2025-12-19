import { error } from "@sveltejs/kit";
import type { PageLoad, PageLoadEvent } from "../../$types";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { loadFollowedRestaurants } from "$lib/core/actions/restaurant/load-followed-restaurants";

export const load: PageLoad = async (event: PageLoadEvent) => {
    const { parent } = event;
    const { user } = await parent();

    if (!user) {
        throw error(401, DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    const offset: number | null = parseInt(event.url.searchParams.get('offset') ?? '0');

    let followedRestaurants = await loadFollowedRestaurants(offset);
    if (followedRestaurants.error !== null) {
        throw error(followedRestaurants.error.status, followedRestaurants.error);
    }

    return { followedRestaurants: followedRestaurants.data, user, offset };
}
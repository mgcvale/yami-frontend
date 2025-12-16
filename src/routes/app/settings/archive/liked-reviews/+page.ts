import { error } from "@sveltejs/kit";
import type { PageLoad, PageLoadEvent } from "../../$types";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { loadAllLikedReviews } from "$lib/core/actions/review/load-all-liked-reviews";

export const load: PageLoad = async (event: PageLoadEvent) => {
    const { parent } = event;
    const { user } = await parent();

    if (!user) {
        throw error(401, DEFAULT_ERRORS.USER_NOT_LOADED);
    }

    const offset: number | null = parseInt(event.url.searchParams.get('offset') ?? '0');

    let likedReviews = await loadAllLikedReviews(offset);
    if (likedReviews.error !== null) {
        throw error(likedReviews.error.status, likedReviews.error);
    }

    return { likedReviews: likedReviews.data, user, offset };
}
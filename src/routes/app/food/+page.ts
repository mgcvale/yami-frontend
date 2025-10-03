import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { error } from "@sveltejs/kit";
import type { PageLoad, PageLoadEvent } from "./$types";
import type { SyncState } from "$lib/core/model/sync-state";
import type { Food } from "$lib/core/model/food";
import { loadFood } from "$lib/core/actions/food/load-food";
import { loadFoodStats } from "$lib/core/actions/food/load-food-stats";
import type { RatingDistribution } from "$lib/core/model/rating-distribution";
import type { ReviewStats } from "$lib/core/model/review-stats";
import type { PageableEntry } from "$lib/core/model/pageable-entry";
import type { FoodReview } from "$lib/core/model/food-review";
import { loadFoodReviews } from "$lib/core/actions/food/load-food-reviews";

export const load: PageLoad = async (event: PageLoadEvent) => {
    await event.parent();
    const id: number = parseInt(event.url.searchParams.get('id') ?? '-1');

    if (id == -1) {
        throw error(DEFAULT_ERRORS.INVALID_PAGE_PARAMS.status, DEFAULT_ERRORS.INVALID_PAGE_PARAMS);
    }

    const food: SyncState<Food> = await loadFood(id);
    if (food.error) throw (food.error.status, food.error);

    const foodRD: SyncState<RatingDistribution> = await loadFoodStats(id);
    if (foodRD.error) throw (foodRD.error.status, foodRD.error);

    const foodStats: ReviewStats = {
        ratingDistribution: foodRD.data,
        averageRating: food.data?.avgRating
    } as ReviewStats;

    const reviews: SyncState<PageableEntry<FoodReview>> = await loadFoodReviews(id);
    if (reviews.error) throw (reviews.error.status, reviews.error);

    return { food: food.data, foodStats, reviews: reviews.data };
}
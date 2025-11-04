import type { PageLoad, PageLoadEvent } from "./$types";
import type { Restaurant } from "$lib/core/model/restaurant";
import type { SyncState } from "$lib/core/model/sync-state";
import { loadRestaurant } from "$lib/core/actions/restaurant/load-restaurant";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { error } from "@sveltejs/kit";

export const ssr = false;

export const load: PageLoad = async (event: PageLoadEvent) => { 
    const id: string | null = event.url.searchParams.get('id');
    let page: string | null = event.url.searchParams.get('page') || 'foods';

    if (!id) {
        throw error(DEFAULT_ERRORS.INVALID_PAGE_PARAMS.status, DEFAULT_ERRORS.INVALID_PAGE_PARAMS);
    }

    const restaurantId: number = parseInt(id);

    const res: SyncState<Restaurant> = await loadRestaurant(restaurantId);
    if (res.error) {
        throw error(res.error.status, res.error);
    }

    return { restaurant: res.data, restaurantId, page };
}
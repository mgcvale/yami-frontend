import { loadRestaurant } from "$lib/core/actions/restaurant/loadRestaurant";
import { isErrorResponse } from "$lib/core/types/errorResponse";
import { error } from "@sveltejs/kit";
import type { PageLoad, PageLoadEvent } from "./$types";
import type Restaurant from "$lib/core/model/restaurant";

export const ssr = false;

export interface ResponseData {
    restaurant: Restaurant
};

export const load: PageLoad = async (event: PageLoadEvent) => { 
    const id: string | null = event.url.searchParams.get('id');

    if (!id) {
        return { id: null, error: 'Missing ID' };
    }

    const restaurantId: number = parseInt(id);

    try {
        const data = await loadRestaurant(restaurantId);
        return data;
    } catch (err) {
        if (isErrorResponse(err)) {
            throw error(err.status, {status: err.status, json: err.json, message: ""});
        }
    }
}
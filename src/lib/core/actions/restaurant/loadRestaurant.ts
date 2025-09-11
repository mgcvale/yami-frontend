import config from "$lib/config";
import type Restaurant from "$lib/core/model/restaurant";
import { fetchWithTimeout } from "$lib/core/util/util";
import { handleResponse } from "../util";

export async function loadRestaurant(id: number): Promise<Restaurant> {
    const res = await fetchWithTimeout(
        config.apiPaths.restaurant(id),
        {},
        config.fetchTimeout
    );

    return handleResponse(res);
}

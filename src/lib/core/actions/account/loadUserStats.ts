import config from "$lib/config";
import type ReviewStats from "$lib/core/model/reviewStats";
import type { AsyncState } from "$lib/core/types/asyncState";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { fetchWithTimeout } from "$lib/core/util/util";
import { writable, type Writable } from "svelte/store";

export const loadUserStatsStore: Writable<AsyncState<ReviewStats>> = writable({
    loading: true,
    data: null,
    error: null
});

export function loadUserStats(id: number): void {

    fetchWithTimeout(config.apiPaths.userStats(id), {}, config.fetchTimeout)
    .then(res => {
        console.log("got response");
        if (!res.ok) {
            return res.json().then((data) => {
                throw {
                    status: res.status,
                    json: data
                } as ErrorResponse;
            });
        }
        return res.json();
    })
    .then(json => {
        loadUserStatsStore.set({
            data: {
                averageRating: json.averageRating,
                ratingDistribution: json.ratingDistribution,
            },
            loading: false,
            error: null,
        });
    })
    .catch(err => {
        loadUserStatsStore.set({
            data: null,
            error: err,
            loading: false,
        });
    });    
}
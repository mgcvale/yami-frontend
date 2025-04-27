import config from "$lib/config";
import type ReviewStats from "$lib/core/model/reviewStats";
import type { AsyncState } from "$lib/core/types/asyncState";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import { writable, type Writable } from "svelte/store";

export function getUserStats(id: number): Writable<AsyncState<ReviewStats>> {
    console.log("loading user stats");
    const state: Writable<AsyncState<ReviewStats>> = writable({
        loading: true,
        error: null,
        data: null,
    });

    fetch(config.apiPaths.userStats(id))
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
        state.set({
            data: {
                averageRating: json.averageRating,
                ratingDistribution: json.ratingDistribution,
            },
            loading: false,
            error: null,
        });
    })
    .catch(err => {
        state.set({
            data: null,
            error: err,
            loading: false,
        });
    });
    
    return state;
}
<script lang="ts">
    import { loadUserReviews } from "$lib/core/actions/account/load-user-reviews";
    import type { FoodReview } from "$lib/core/model/food-review";
    import type { PageableEntry } from "$lib/core/model/pageable-entry";
    import { type SyncState } from "$lib/core/model/sync-state";
    import { onMount } from "svelte";
    import FoodReviewCard from "./cards/FoodReviewCard.svelte";
    import { loadRestaurantFoodReviews } from "$lib/core/actions/restaurant/load-restaurant-reviews";

    let loading = $state(true);
    let response = $state<SyncState<PageableEntry<FoodReview>>>({data: null, error: null});

    let {
        id = $bindable(),
        viewingSelf = false,
        userReviews = true,
        className = ""
    }:
    {
        viewingSelf: boolean,
        id: number,
        userReviews: boolean,
        className: string
    } = $props();

    const load = async () => {
        loading = true;
        if (userReviews) {
            response = await loadUserReviews(id);
        } else {
            response = await loadRestaurantFoodReviews(id);
        }
        loading = false;
    }
    
    onMount(async () => load());
</script>

<div class="flex flex-col w-full h-fit justify-start items-center gap-4 {className}">
    {#if loading}
    <span>loading...</span>
    {:else if response.data === null}
        <h3 class="text-light-error dark:text-dark-error">An error occourred.</h3>
        <span> error: {response.error?.message} </span>
        <button class="underline py-1" onclick={() => load()}>Retry</button>
    {:else}
        {#each response.data.content as entry }
            <FoodReviewCard type={userReviews ? "user" : "restaurant"} ownsReview={viewingSelf} review={entry} collapsed={false} />
        {/each}
    {/if}
</div>
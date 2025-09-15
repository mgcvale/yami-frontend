<script lang="ts">
    import { loadFoodReviews } from "$lib/core/actions/account/load-food-reviews";
    import { createAsyncOperation } from "$lib/core/runes/async-operation";
    import FoodReviewCard from "./cards/FoodReviewCard.svelte";

    const loadFoodReviewsOP = createAsyncOperation(() => loadFoodReviews(userId));

    let {
        userId = $bindable(),
        className = ""
    }:
    {
        userId: number
        className: string
    } = $props();
    
    $effect(() => {
        loadFoodReviews(userId);
    });


</script>

<div class="flex flex-col w-full h-fit justify-start items-center gap-4 {className}">
    {#if loadFoodReviewsOP.isLoading}
    <span>loading...</span>
    {:else if loadFoodReviewsOP.response.data === null}
        <h3 class="text-light-error dark:text-dark-error">An error occourred.</h3>
        <span> error: {loadFoodReviewsOP.response.error} </span>
    {:else}
        {#each loadFoodReviewsOP.response.data.content as entry }
        <FoodReviewCard review={entry} collapsed={false} />
        {/each}
    {/if}
</div>
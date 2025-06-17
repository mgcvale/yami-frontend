<script lang="ts">
    import { loadFoodReviews, loadFoodReviewStore } from "$lib/core/actions/account/loadFoodReviews";
    import { onMount } from "svelte";
    import FoodReviewCard from "./cards/FoodReviewCard.svelte";

    
    let {
        userId,
        className = ""
    }:
    {
        userId: number
        className: string
    } = $props();

    onMount(() => {
        loadFoodReviews(userId);
    })


</script>

<div class="flex flex-col w-full h-fit justify-start items-center gap-4 {className}">
    {#if $loadFoodReviewStore.loading}
    <span>loading...</span>
    {:else if $loadFoodReviewStore.data === null}
        <span> error: {$loadFoodReviewStore.error?.status} </span>
    {:else}
        {#each ($loadFoodReviewStore).data.content as entry }
        <FoodReviewCard review={entry} collapsed={false} />
        {/each}
    {/if}
</div>
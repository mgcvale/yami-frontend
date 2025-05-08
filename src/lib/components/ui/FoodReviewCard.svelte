<script lang="ts">
    import config from "$lib/config";
import type { FoodReview } from "$lib/core/model/foodReview";
    import { Heart, Repeat2 } from "@lucide/svelte";
    import ListCard from "./ListCard.svelte";

    let {
        review = $bindable(),
        collapsed = false
    }: {
        review: FoodReview,
        collapsed: boolean
    } = $props();

</script>

<ListCard className={(collapsed ? "bg-light-card-2 dark:bg-dark-card-2" : "") + " pt-4"}>
    {#if collapsed}
    <div class="flex justify-start items-center h-8">
        <img class="h-full aspect-square w-auto rounded-md" src="{config.apiPaths.foodImage(review.foodId)}" alt="{review.foodName}'s food">
        <div class="flex flex-col justify-between items-start">
            <span class="text-light-fg-100 dark:text-dark-fg-100">
                Review by {review.username}
            </span>
            <span class="text-light-fg-300 dark:text-dark-fg-300">
                Rating: {review.rating * 2}
            </span>
        </div>
    </div>
    {:else}
    <div class="flex justify-around items-center h-10 text-start w-full gap-2">
        <img
            class="h-full aspect-square rounded-md"
            src="{config.apiPaths.restaurantImage(review.restaurantId)}"
            alt="{review.restaurantName}"
        />
        
        <div class="grow overflow-hidden">
            <div class="text-light-fg-500 dark:text-dark-fg-500 font-alegreya text-lg leading-tight truncate" title="{review.restaurantName}">
                {review.restaurantName}
            </div>
            <div class="text-light-fg-300 dark:text-dark-fg-300 text-sm truncate" title="{review.foodName} review">
                {review.foodName} review
            </div>
        </div>

      
        <span class="min-w-fit font-bold {
                review.rating === 20 ? "text-rating-top" :
                review.rating >= 15 ? "text-rating-great" :
                review.rating >= 10 ? "text-rating-good" :
                review.rating >= 5 ? "text-rating-bad" :
                "text-rating-terrible" }"
        >
            {review.rating / 2} / 10
        </span>
    </div>
    <p class="text-start pt-1">
        {review.review}
    </p>
    <div class="w-full flex justify-end items-center gap-2 pt-1 text-light-fg-700 dark:text-dark-fg-700">
        <Repeat2 />
        <Heart />
    </div>
    {/if}
</ListCard>
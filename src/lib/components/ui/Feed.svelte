<script lang="ts">
    import type { FoodReview } from "$lib/core/model/food-review";
    import FeedReviewCard from "./cards/FeedReviewCard.svelte";
    import FoodReviewCard from "./cards/FoodReviewCard.svelte";
    import RestaurantReccomendationCard from "./cards/RestaurantReccomendationCard.svelte";
    import FoodReviewList from "./FoodReviewList.svelte";


    let { className = "", content }: {
        className: string,
        content: FoodReview[]
    } = $props();

</script>

<div class="flex flex-col justify-start items-start p-4 gap-2 {className}">
    <h1 class="font-alegreya text-3xl">Your feed</h1>

    <div class="flex flex-col w-full h-fit justify-start items-center gap-4 {className}">
        {#each content as entry, i}
            <FeedReviewCard review={entry} />
            {#if i == 6}
                <RestaurantReccomendationCard />
            {/if}
        {/each}
    </div>
</div>
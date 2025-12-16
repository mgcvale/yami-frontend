<script lang="ts">
    import type { FoodReview } from "$lib/core/model/food-review";
    import RatingPill from "../controls/RatingPill.svelte";
    import { goto } from "$app/navigation";
    import ReviewInteractionbar from "../ReviewInteractionbar.svelte";

    let {
        review = $bindable(),
    }: {
        review: FoodReview,
    } = $props();

    let foodImgError = $state(false);
    
</script>

<div class="flex flex-col gap-1 w-full">
    <div class="bg-light-card-1 dark:bg-dark-card-1 rounded-xl overflow-hidden shadow-sm p-5 flex flex-col gap-3 min-w-full rounded-b-lg">

        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a
                    href={`/app/user?id=${review.userId}`}
                    onclick={e => { e.preventDefault(); goto(`/app/user?id=${review.userId}`); }}
                >
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        alt="Avatar de {review.username}"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                </a>
                <div class="flex gap-2">
                    <a
                        href={`/app/user?id=${review.userId}`}
                        onclick={e => { e.preventDefault(); goto(`/app/user?id=${review.userId}`); }}
                        class="font-semibold text-light-fg-900 dark:text-dark-fg-100 hover:underline"
                    >
                        {review.username}
                        
                    </a>
                    •
                    <RatingPill rating={review.rating} />
                </div>
                
            </div>
        </div>

        <div class="flex justify-between">
            <div class="flex flex-col w-full">
                <a
                    href={`/app/food?id=${review.foodId}`}
                    onclick={e => { e.preventDefault(); goto(`/app/food?id=${review.foodId}`); }}
                    class="font-semibold font-alegreya text-light-fg-900 dark:text-dark-fg-100 hover:underline text-xl"
                >
                    {review.foodName}
                </a>
                <a
                    href={`/app/restaurant?id=${review.restaurantId}`}
                    onclick={e => { e.preventDefault(); goto(`/app/restaurant?id=${review.restaurantId}`); }}
                    class="text-light-fg-500 dark:text-dark-fg-500 text-sm hover:underline"
                >
                    {review.restaurantName}
                </a>
                <div class="flex justify-between items-start grow pt-4 w-full gap-2">
                    <p class="text-light-fg-700 dark:text-dark-fg-300 text-sm">
                        {review.review}
                    </p><!--
                    <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md overflow-hidden shrink-0">
                        {#if !foodImgError}
                            <img
                                src="{config.apiPaths.foodImage(review.foodId)}"
                                alt="{review.foodName}"
                                class="w-full h-full object-cover"
                                onerror={() => { foodImgError = true; }}
                            />
                        {:else}
                            <ImageIcon class="w-8 h-8 text-light-fg-400 dark:text-dark-fg-400" />
                        {/if}
                    </div>-->
                </div>
            </div>
        </div>
    </div>
    <ReviewInteractionbar bind:review />
</div>

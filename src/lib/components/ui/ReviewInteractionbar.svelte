<script lang="ts">
    import { Send } from "@lucide/svelte";
    import { doLike, doUnlike } from "$lib/core/actions/review/like-food-review";
    import type { FoodReview } from "$lib/core/model/food-review";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import { scale } from "svelte/transition";
    import ErrorSnackbar from "./ErrorSnackbar.svelte";
    import { Heart } from "@lucide/svelte";
    import { currentThemeLight } from "$lib/core/util/theme-manager";
    import { formatRelativeTime } from "$lib/core/util/time";


    let {
        review = $bindable(),
    }: {
        review: FoodReview,
    } = $props();


    let isReviewLiked = $derived(review.liked);
    let reviewLikeCount = $derived(review.likeCount);

    async function onLike() {
        if (isReviewLiked) {
            return;
        }
        isReviewLiked = true;
        reviewLikeCount++;
        const res = await doLike(review.id);
        if (res.error !== null) {
            isReviewLiked = false;
            reviewLikeCount--;
            likeError(res.error);
        }
    }

    async function onUnlike() {
        console.log(isReviewLiked);
        if (!isReviewLiked) {
            likeError({
                message: "You cannot unlike a review that is not liked"
            } as App.Error);
        }
        isReviewLiked = false;
        reviewLikeCount--;
        const res = await doUnlike(review.id);
        if (res.error != null) {
            isReviewLiked = true;
            reviewLikeCount++;
            likeError(res.error)
        }
    }

    function likeError(error: App.Error) {
        snackbarStore.set({
            component: ErrorSnackbar,
            props: {
                warningMessage: `Unable to like review: ${error.message}`
            }
        });
    }
</script>


<div class="bg-light-card-1 dark:bg-dark-card-1 rounded-xl overflow-hidden shadow-sm p-3 flex justify-between min-w-full rounded-t-lg">
    <div>
        <p class="text-sm pl-1">Posted {formatRelativeTime(review.ageInDays)}</p>
    </div>
    <div class="flex justify-end items-center text-light-fg-700 dark:text-dark-fg-700 self-end gap-4 pr-1">
        <Send size={20} />
        <div class="flex gap-2">
            {reviewLikeCount}
            <div class="grid w-6 h-6 place-items-center">
                {#if isReviewLiked}
                    <div 
                        class="col-start-1 row-start-1" 
                        transition:scale={{ 
                            duration: 200, 
                            start: 0.2, 
                        }}
                    >
                        <Heart 
                            fill={$currentThemeLight ? "#ee3333" : "#cc4444" }
                            color={$currentThemeLight ? "#ee3333" : "#cc4444" }
                            onclick={onUnlike} 
                        />
                    </div>
                {:else}
                    <div 
                        class="col-start-1 row-start-1" 
                        transition:scale={{ 
                            duration: 200, 
                            start: 0.2, 
                        }}
                    >
                        <Heart 
                            onclick={onLike} 
                        />
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
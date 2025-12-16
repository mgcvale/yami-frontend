<script lang="ts">
    import type { FoodReview } from "$lib/core/model/food-review";
    import { X } from "@lucide/svelte";
    import Divisor from "../Divisor.svelte";
    import Rating from "../Rating.svelte";
    import Button from "../controls/Button.svelte";
    import { modalStore } from "$lib/core/store/modalStore";

    let { review }: { review: FoodReview } = $props();
</script>

<div class="p-2 pt-0 relative">
    <X size={16} strokeWidth={2.5} class="absolute top-2.5 right-2.5" onclick={() => modalStore.set(null)}/>

    <h1 class="font-alegreya text-2xl">{review.username}'s Review</h1>
    <h2 class="text-lm"><Rating rating={review.rating} className="text-sm font-medium font-alegreya"/> para {review.foodName}</h2>
    <Divisor lineClassName="bg-light-card-3 dark:bg-dark-card-2" containerClassName="px-0.5 py-4 max-w-32 m-auto" />
    <p class="text-sm pb-2">{review.review}</p>
    <div class="flex items-center justify-end">
        <Button onclick={() => modalStore.set(null)} className="px-4">OK</Button>
    </div>
</div>
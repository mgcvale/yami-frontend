<script lang="ts">
    import type { FoodReview } from "$lib/core/model/food-review";
    import { modalStore } from "$lib/core/store/modalStore";
    import { X } from "@lucide/svelte";
    import PageTitle from "../controls/PageTitle.svelte";
    import Slider from "../controls/Slider.svelte";
    import Button from "../controls/Button.svelte";
    import TextField from "../controls/TextField.svelte";
    import { updateFoodReview } from "$lib/core/actions/review/update-food-review";

    let {
        review = $bindable()
    }: {
        review: FoodReview
    } = $props();

    let actualRating = $state(review.rating/2);
    let actualReview = $state(review.review);
    let errorMessage = $state("");
    let buttonDisabled = $derived(actualRating === review.rating/2 && actualReview === review.review);

    async function updateReview() {
        const res = await updateFoodReview(review.id, actualReview, actualRating * 2);
        if (res.error !== null) {
            errorMessage = "An error ocurred: ".concat(res.error.message);
        } else {
            review = res.data;
            modalStore.set(null);
        }
    }

</script>

<X class="absolute cursor-pointer top-4 right-4" onclick={() => modalStore.set(null)} />

<div class="flex justify-between px-2 py-1 pb-4">
    <PageTitle className=" p-0!">Edit {review.foodName}'s review</PageTitle>
</div>
<div class="flex flex-col gap-4">

    <Slider bind:value={actualRating} name="Rating" className="mt-4" />
    <div class="flex flex-col">
        <span class="pl-1">Review</span>
        <TextField maxLength={256} bind:value={actualReview} textarea={true} noDecoration={true} placeholder="Review (optional)" className="grow"></TextField>
    </div>

    {#if errorMessage && errorMessage !== ""}
        <span class="text-light-error dark:text-dark-error text-center pb-2">Error: {errorMessage}</span>
    {/if}
    <Button accent={true} bind:disabled={buttonDisabled} onclick={updateReview}>Update info</Button>
</div>


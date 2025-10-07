<script lang="ts">
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Card2 from "$lib/components/ui/cards/Card2.svelte";
    import PageTitle from "$lib/components/ui/controls/PageTitle.svelte";
    import Rating from "$lib/components/ui/Rating.svelte";
    import RatingStats from "$lib/components/ui/RatingStats.svelte";
    import config from "$lib/config";
    import type { Food } from "$lib/core/model/food";
    import type { FoodReview } from "$lib/core/model/food-review";
    import type { PageableEntry } from "$lib/core/model/pageable-entry";
    import type { ReviewStats } from "$lib/core/model/review-stats";
    import { ChevronLeft, Edit, Heart, Image, ListFilterPlus } from "@lucide/svelte";
    import RatingWithPercentage from "$lib/components/ui/RatingWithPercentage.svelte";
    import { currentUserStore, modalStore } from "$lib";
    import FoodReviewModal from "$lib/components/ui/modals/FoodReviewModal.svelte";
    import Button from "$lib/components/ui/controls/Button.svelte";
    import Divisor from "$lib/components/ui/Divisor.svelte";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import ErrorSnackbar from "$lib/components/ui/ErrorSnackbar.svelte";
    import HeaderWithBackButton from "$lib/components/ui/HeaderWithBackButton.svelte";

    let { data }: { data: { food: Food, foodStats: ReviewStats, reviews: PageableEntry<FoodReview> } } = $props();

    function onReviewClick(review: FoodReview) {
        console.log(review);
        modalStore.set({
            component: FoodReviewModal,
            props: { review }
        });
    }

    function onCreateReviewClick() {
        if ($currentUserStore.data === null) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: "You have to be logged in to create a review."
                }
            })
        }
    }

    console.log(data.food)
</script>

<HeaderWithBackButton title="Food Information" />

<div class="flex flex-col w-full items-center justify-start p-3 pt-1 gap-3">
    <Card1 className="flex flex-col items-start justify-start max-w-full w-full gap-2">
        <div class="flex justify-start items-stretch gap-3 w-full min-w-0">
            <img
                src={config.apiPaths.foodImage(data.food.id)}
                alt="Food"
                class="rounded-lg aspect-square object-cover flex-1 min-w-0 self-start"
            />
            <div class="flex flex-col flex-shrink-0">
                <h3 class="font-alegreya text-lg">
                    {data.food.restaurantShortName}'s {data.food.name}
                </h3>
                <a href={`/app/restaurant?id=${data.food.restaurantId}`} class="underline">{data.food.restaurantName}</a>
                <div class="flex-1 flex flex-col justify-center">
                <RatingWithPercentage rating={data.food.avgRating} className={""}/>
                </div>
            </div>
        </div>
        <p class="text-ms">R$1,00 • {data.food.description}{(!data.food.description.endsWith('.')) ? "." : ""}</p>
        {#if data.food.review === null}
            <Button className="w-full" onclick={() => onCreateReviewClick()}>Review this food</Button>
        {/if}
    </Card1>
    <RatingStats name={data.food.name} stats={data.foodStats} className={""} />
    {#if data.food.review !== null && data.food.review !== undefined}
        <Card1 className="w-full p-3!">
            <div class="flex justify-between pb-3 px-1">
                <h3 class="font-alegreya text-lg">Your review</h3>
                <Edit class="cursor-pointer"/>
            </div>
            <Card2 className="flex justify-start flex-col items-start rounded-lg w-full px-3! py-2! cursor-pointer">
                <h2 class="text-lm pb-2"><Rating rating={data.food.review.rating} className="text-sm font-medium font-alegreya"/> to {data.food.name}</h2>
                <p class="text-sm pb-2">{data.food.review.review}</p>

            </Card2>
        </Card1>
    {/if}
    <Card1 className="w-full p-3!">
        <div class="flex justify-between pb-3 px-1">
            <h3 class="font-alegreya text-lg">Latest reviews</h3>
            <ListFilterPlus class="cursor-pointer"/>
        </div>

        {#each data.reviews.content as review: FoodReview, i}
            <div
                onclick={() => onReviewClick(review)} 
                role="button" tabindex={i} 
                onkeypress={(e) => {
                    if (e.key === 'enter') {
                        onReviewClick(review);
                    }
                }} 
                class="w-full"
            >
            <Card2 className="flex justify-start items-center rounded-lg w-full px-3! py-2! cursor-pointer">
                <div class="h-full  aspect-square pr-3 flex items-center justify-center">
                    <Image size={32}/>
                </div>
                <div class="flex flex-col items-start justify-start dark:text-dark-fg-300 text-light-fg-300 ">
                    <h2>Review  by {review.username}</h2>
                    <h2>Rating: <Rating rating={review.rating} className=""/></h2>
                </div>
                <div class="flex-grow"></div>
                <div class="flex flex-col justify-between items-center">
                    <Heart size={16} strokeWidth={3} />
                </div>
            </Card2>
            </div>
        {/each}

    </Card1>
</div>
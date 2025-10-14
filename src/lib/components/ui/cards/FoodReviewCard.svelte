<script lang="ts">
    import config from "$lib/config";
    import type { FoodReview } from "$lib/core/model/foodReview";
    import { Heart, MoreHorizontal, MoreVertical, Pencil, Repeat2, Trash } from "@lucide/svelte";
    import ListCard from "./ListCard.svelte";
    import RatingPill from "../controls/RatingPill.svelte";
    import { goto } from "$app/navigation";
    import ContextMenu from "../controls/ContextMenu.svelte";
    import type ContextMenuEntry from "$lib/core/types/context-menu-entry";
    import { modalStore } from "$lib/core/store/modalStore";
    import ConfirmationModal from "../modals/ConfirmationModal.svelte";
    import { deleteFoodReview } from "$lib/core/actions/review/delete-food-review";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import ErrorSnackbar from "../ErrorSnackbar.svelte";
    import SuccessSnackbar from "../SuccessSnackbar.svelte";
    import FoodReviewEditingModal from "../modals/FoodReviewEditingModal.svelte";

    let {
        review = $bindable(),
        collapsed = false,
        ownsReview = false,
    }: {
        review: FoodReview,
        collapsed: boolean,
        ownsReview: boolean
    } = $props();

    function onEditClick() {
        modalStore.set({
            component: FoodReviewEditingModal,
            props: {
                review
            }
        });
    }
    
    function onDeleteClick() {
        modalStore.set({
            component: ConfirmationModal,
            props: {
                actionName: "Delete this review",
                action: (confirmed: boolean) => {if (confirmed) doDelete();}
            }
        });
    }

    async function doDelete() {
        const res: SyncState<null> = await deleteFoodReview(review.id);
        if (res.error !== null) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: `Error deleting your review: ${res.error.message}`
                }
            });
        } else {
            snackbarStore.set({
                component: SuccessSnackbar,
                props: {
                    successMessage: "Success deleting your review!"
                }
            });
            deleted = true;
        }
    }

    let deleted = $state(false);
    let showingContextMenu = $state(false);
    const contextMenuEntries: ContextMenuEntry[] = [
        {
            name: "Edit",
            icon: Pencil,
            action: onEditClick
        },
        {
            name: "Delete",
            icon: Trash,
            action: onDeleteClick,
            className: "text-light-error dark:text-dark-error"
        }
    ];
</script>

{#if !deleted}
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

        <a
            href={`/app/restaurant?id=${review.restaurantId}`}
            onclick={e => {
                e.preventDefault();
                goto(`/app/restaurant?id=${review.restaurantId}`);
            }}
            aria-label="View details for {review.restaurantName}"
            class="h-full"
        >
            <img
                class="h-full aspect-square rounded-md"
                src="{config.apiPaths.restaurantImage(review.restaurantId)}"
                alt="{review.restaurantName}"
            />
        </a>
        
        <div class="grow overflow-hidden">
            
            <a 
                href={`/app/restaurant?id=${review.restaurantId}`}
                onclick={e => {
                    e.preventDefault();
                    goto(`/app/restaurant?id=${review.restaurantId}`);
                }}
                aria-label="View details for {review.restaurantName}"
                class="text-light-fg-500 dark:text-dark-fg-500 font-alegreya text-lg leading-tight truncate" title="{review.restaurantName}"
            >
                {review.restaurantName}
            </a>
            <a href={`/app/food?id=${review.foodId}`} class="block text-light-fg-300 dark:text-dark-fg-300 text-sm truncate" title="{review.foodName} review">
                {review.foodName} review
            </a>
        </div>

        <RatingPill rating={review.rating}>
        </RatingPill>
        <div class="flex relative">
            <MoreVertical size={20} onclick={() => setTimeout(() => showingContextMenu = true)}/>
            <ContextMenu bind:showing={showingContextMenu} entries={contextMenuEntries} className="bg-light-card-2! dark:bg-dark-card-2!"></ContextMenu>
        </div>
    </div>
    <p class="text-start pt-1 text-ms">
        {review.review}
    </p>
    <div class="w-full flex justify-end items-center gap-4 plr-2 pt-1 text-light-fg-700 dark:text-dark-fg-700">
        <Repeat2 />
        <Heart />
    </div>
    {/if}
</ListCard>
{/if}
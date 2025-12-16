<script lang="ts">
    import config from "$lib/config";
    import type { FoodReview } from "$lib/core/model/food-review";
    import { Heart, MoreHorizontal, MoreVertical, Pencil, Trash } from "@lucide/svelte";
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
    import ReviewInteractionbar from "../ReviewInteractionbar.svelte";

    let {
        review = $bindable(),
        ownsReview = false,
        type = "user"
    }: {
        type?: "user" | "restaurant"
        review: FoodReview,
        ownsReview: boolean
    } = $props();

    function onEditClick() {
        modalStore.set({
            component: FoodReviewEditingModal,
            props: {
                review: review,
                onUpdated: (r: FoodReview) => {
                    review = r;
                }
            }
        });
    }
    
    function onDeleteClick() {
        modalStore.set({
            component: ConfirmationModal,
            props: {
                actionName: "Deletar essa review",
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
                    warningMessage: `Erro deletando sua review: ${res.error.message}`
                }
            });
        } else {
            snackbarStore.set({
                component: SuccessSnackbar,
                props: {
                    successMessage: "Sucesso deletando sua review!"
                }
            });
            deleted = true;
        }
    }

    let deleted = $state(false);
    let showingContextMenu = $state(false);
    const contextMenuEntries: ContextMenuEntry[] = ownsReview ? [
        {
            name: "Editar",
            icon: Pencil,
            action: onEditClick
        },
        {
            name: "Deletar",
            icon: Trash,
            action: onDeleteClick,
            className: "text-light-error dark:text-dark-error"
        }
    ] : [];
</script>

{#if !deleted}
<div class="flex flex-col gap-1 w-full">
    <div class="bg-light-card-1 dark:bg-dark-card-1 rounded-xl overflow-hidden shadow-sm p-5 flex flex-col gap-3 min-w-full rounded-b-lg">
        <div class="flex justify-around items-center h-10 text-start w-full gap-2">
            {#if type == "user"}
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
            {:else}
                <a
                    href={`/app/user?id=${review.userId}`}
                    onclick={e => {
                        e.preventDefault();
                        goto(`/app/restaurant?id=${review.restaurantId}`);
                    }}
                    aria-label="Go to {review.username}'s page"
                    class="h-full"
                >
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        alt="{review.username}'s avatar"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                </a>
            {/if}
            
            <div class="grow overflow-hidden">
                <a 
                    href={type == "user" ? `/app/restaurant?id=${review.restaurantId}` : `/app/user?id=${review.userId}`}
                    aria-label="View details for {type == "user" ? review.restaurantName : review.username}"
                    class="text-light-fg-500 dark:text-dark-fg-500 font-alegreya text-lg leading-tight truncate" title="{type == "user" ? review.restaurantName : review.username}"
                >
                    {type == "user" ? review.restaurantName : `Review por ${review.username}`}
                </a>
                <a href={`/app/food?id=${review.foodId}`} class="block text-light-fg-300 dark:text-dark-fg-300 text-sm truncate" title="{review.foodName} review">
                    {review.foodName}
                </a>
            </div>

            <RatingPill rating={review.rating}>
            </RatingPill>
            {#if contextMenuEntries.length !== 0}
                <div class="flex relative">
                    <MoreVertical size={20} onclick={() => setTimeout(() => showingContextMenu = true)}/>
                    <ContextMenu bind:showing={showingContextMenu} entries={contextMenuEntries} className="bg-light-card-2! dark:bg-dark-card-2!"></ContextMenu>
                </div>
            {/if}
        </div>
        <p class="text-start pt-1 text-ms">
            {review.review}
        </p>
    </div>
    <ReviewInteractionbar bind:review />
</div>
{/if}
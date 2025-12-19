<script lang="ts">
    import { goto } from "$app/navigation";
    import FoodReviewCard from "$lib/components/ui/cards/FoodReviewCard.svelte";
    import RestaurantCard from "$lib/components/ui/cards/RestaurantCard.svelte";
    import type { CurrentUser } from "$lib/core/model/current-user";
    import type { FoodReview } from "$lib/core/model/food-review";
    import type { PageableEntry } from "$lib/core/model/pageable-entry";
    import type { BasicRestaurant } from "$lib/core/model/restaurant";
    import { ChevronLeft, ChevronRight } from "@lucide/svelte";

    let { 
        data
    }: {
        data: { followedRestaurants: PageableEntry<BasicRestaurant>, user: CurrentUser }
    } = $props();

    const { number, size, numberOfElements, totalElements, totalPages, first, last } = data.followedRestaurants;

    function goToPage(pageIndex: number) {
        console.log(pageIndex);
        goto(`/app/settings/archive/liked-reviews?offset=${pageIndex}`, { invalidateAll: true });
    }

    const MAX_PAGES_SHOWN = 4;

    function getPagesToShow() {
        const pages = [];

        if (totalPages <= 1) return [];

        let start = Math.max(0, number - Math.floor(MAX_PAGES_SHOWN / 2));
        let end = Math.min(totalPages - 1, start + MAX_PAGES_SHOWN - 1);

        if (end - start < MAX_PAGES_SHOWN - 1) {
            start = Math.max(0, end - MAX_PAGES_SHOWN + 1);
            end = Math.min(totalPages - 1, start + MAX_PAGES_SHOWN - 1);
        }

        if (start > 0) {
            pages.push(0);
            if (start > 1) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            if (end < totalPages - 2) pages.push('...');
            pages.push(totalPages - 1);
        }

        return pages.filter((value, index, self) => 
            (typeof value === 'number' || self[index - 1] !== '...')
        );
    }

    const pages = getPagesToShow();

    const startIndex = (number * size) + 1;
    const endIndex = startIndex + numberOfElements - 1;

</script>

{#if data.followedRestaurants.empty}
    <p class="text-center my-4">Não foi encontrada nenhum restaurante seguido por você.</p>
{:else}
    <div class="space-y-4 w-full">
        {#each data.followedRestaurants.content as entry }
            <RestaurantCard restaurant={entry} />
        {/each}
    </div>

    <div class="flex flex-col justify-center items-center pb-2">
        <p class="text-base mb-2">
            Mostrando {startIndex} até {endIndex} de {totalElements}
        </p>
        
        <div class="flex items-center justify-center gap-2">

            {#if !first}
                <button 
                    class="p-1 cursor-pointer"
                    onclick={() => goToPage(number - 1)}
                >
                    <ChevronLeft size={20} />
                </button>
            {/if}

            {#each pages as page}
                {#if page === '...'}
                    <span class="px-1">...</span>
                {:else}
                    <button
                        class:font-bold={page === number}
                        class="px-1 cursor-pointer hover:underline"
                        onclick={() => goToPage((page as number))}
                    >
                        {page as number + 1} </button>
                {/if}
            {/each}
            
            {#if !last}
                <button 
                    class="p-1 cursor-pointer"
                    onclick={() => goToPage(number + 1)}
                >
                    <ChevronRight size={20} />
                </button>
            {/if}
        </div>
    </div>
{/if}
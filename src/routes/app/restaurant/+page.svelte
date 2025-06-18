<script lang="ts">
    import { onNavigate } from "$app/navigation";
    import { page } from "$app/state";   
    import { currentUserStore, LoginAsker, modalStore, type CurrentUser, type PublicUser } from "$lib";
    import Divisor from "$lib/components/ui/Divisor.svelte";
    import FoodReviewList from "$lib/components/ui/FoodReviewList.svelte";
    import RatingStats from "$lib/components/ui/RatingStats.svelte";
    import RestaurantHeader from "$lib/components/ui/RestaurantHeader.svelte";
    import UserHeader from "$lib/components/ui/UserHeader.svelte";
    import { loadPublicAccountStore, loadPublicUser } from "$lib/core/actions/account/loadPublicAccount";
    import { loadUserStats, loadUserStatsStore } from "$lib/core/actions/account/loadUserStats";
    import { loadRestaurant, loadRestaurantStore } from "$lib/core/actions/restaurant/loadRestaurant";
    import type Restaurant from "$lib/core/model/restaurant";
    import type ReviewStats from "$lib/core/model/reviewStats";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    function load(id: string) {
        loadRestaurant(parseInt(id));
    }

    $effect(() => {
        const id: string | null = page.url.searchParams.get('id');
        if (id === null) {
            console.log("ID IS NULL");
            return;
        }
        load(id);
    });

    
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
    {#if $loadRestaurantStore.loading}
        <h2 class="w-full text-center text-xl">Loading...</h2>
    {:else}
        {#if $loadRestaurantStore.data === null}

            {#if $loadRestaurantStore.error !== null}
                <h2 class="text-xl text-light-error dark:text-dark-error w-full text-center">An error occurred!</h2>
                {#if $loadRestaurantStore.error.status === 404}
                    <p>The user you requested wasn't found.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if $loadRestaurantStore.error.status === 500}
                    <p>An error occurred on our end. You can try again later.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if $loadRestaurantStore.error instanceof TypeError}
                    <p>A network error occurred. Check if you're connected to the internet</p>
                {:else}
                    <p>An unknown error occurred.</p>
                    <p>Error status: {$loadRestaurantStore.error.status}</p>
                {/if}
            {:else}
                <h2 class="text-xl font-alegreya">An unknown error occurred!</h2>
            {/if}

        {:else}
            <RestaurantHeader />
        {/if}
    {/if}
</div>
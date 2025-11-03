<script lang="ts">
    import config from "$lib/config";
    import { loadRestaurantReccomendations } from "$lib/core/actions/restaurant/load-restaurant-reccomendations";
    import { syncError, syncSuccess } from "$lib/core/actions/util";
    import type { Restaurant } from "$lib/core/model/restaurant";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { currentUserStore } from "$lib/core/store/currentUserStore";
    import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
    import { Divide } from "@lucide/svelte";
    import { onMount } from "svelte";
    import Divisor from "../Divisor.svelte";

    let loading: boolean = $state(true);
    let data: SyncState<Restaurant[]> = $state(syncSuccess([]));
    
    onMount(async () => {
        loading = true;

        if (!$currentUserStore.data) {
            loading = false;
            data = syncError(DEFAULT_ERRORS.USER_NOT_LOADED);
            return;
        }
        
        data = await loadRestaurantReccomendations($currentUserStore.data.accessToken);
        loading = false;
    })
</script>
<section class="flex flex-col items-start justify-start w-full">
    <Divisor lineClassName="bg-light-card-2 dark:bg-dark-card-2" containerClassName="px-4 py-2" />

    <h3 class="font-alegreya text-2xl">Restaurant recommendations</h3>
    <p class="text-sm">Based on what your friends have been reviewing</p>

    {#if loading}
        <p>Loading your recommendations...</p>
    {:else}
        <div class="grid auto-cols-[minmax(12rem,1fr)] grid-flow-col gap-4 p-4 px-0 pb-0 w-full overflow-x-auto">
            {#if data.error !== null}
                <p class="fg-light-error dark:fg-dark-error">{data.error.message}</p>
            {:else if data.data == null || data.data.length == 0}
                <p>No restaurant recommendations were found for you!</p>
            {:else}
                {#each data.data as restaurant}
                    <a href="/restaurant?id={restaurant.id}" class="h-full w-full">
                        <div class="p-4 flex flex-col items-center justify-start bg-light-card-1 dark:bg-dark-card-1 rounded-xl shadow-xs h-full w-full">
                            <h3 class="font-alegreya text-xl">{restaurant.shortName}</h3>
                            <h4 class="text-xs">{restaurant.name}</h4>
                            <img
                                class="h-20 rounded-full w-auto"
                                src={config.apiPaths.restaurantImage(restaurant.id)}
                                alt="{restaurant.shortName}'s photo"
                            >
                        </div>
                    </a>
                {/each}
            {/if}
        </div>
    {/if}

    <Divisor lineClassName="bg-light-card-2 dark:bg-dark-card-2" containerClassName="px-4 pt-4" />
</section>

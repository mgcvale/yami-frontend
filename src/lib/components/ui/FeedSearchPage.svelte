<script lang="ts">
    import { searchingFor } from "$lib/core/store/searchingForStore";
    import RestaurantCard from "./cards/RestaurantCard.svelte";
    import UserCard from "./cards/UserCard.svelte";
    import { getSearchContext } from '$lib/core/store/search-context.svelte';

    const searchContext = getSearchContext();

    $effect(() => {
        searchContext.results;
    })
</script>

<div class="flex flex-col justify-start items-start p-4 gap-2">
    <div class="flex justify-between items-center w-full pb-4">
        <h1 class="font-alegreya text-2.5xl">Search on yami for {$searchingFor.name}</h1>
    </div>
    
    {#if $searchingFor.value === 'restaurant'}
        {#if searchContext.loading}
            <p>Loading...</p>
        {:else if searchContext.results.restaurants === null}
            <p>Make a search to view results!</p>
        {:else if searchContext.results.restaurants.error !== null}
            <p>Error: {searchContext.results.restaurants.error.message}</p>
        {:else if searchContext.results.restaurants.data !== null}
            {#if searchContext.results.restaurants.data.content.length == 0}
                <h2>No restaurants were found!</h2>
            {:else}
                <h2>Found restaurants:</h2>
                {#each searchContext.results.restaurants.data.content as restaurant}
                    <RestaurantCard {restaurant} />
                {/each}
            {/if}
        {/if}

    {:else if $searchingFor.value === 'food'}
        {#if searchContext.loading}
            <p>Loading...</p>
        {:else if searchContext.results.foods === null}
            <p>Make a search to view results!</p>
        {:else if searchContext.results.foods.error !== null}
            <p>Error: {searchContext.results.foods.error.message}</p>
        {:else if searchContext.results.foods.data !== null}
            {#if searchContext.results.foods.data.content.length == 0}
                <h2>No foods were found!</h2>
            {:else}
                <h2>Found foods:</h2>
                <!-- TODO: add FoodCard component when done -->
                {#each searchContext.results.foods.data.content as food}
                    <!-- <FoodCard {food} /> -->
                    <div>Food: {food.name}</div>
                {/each}
            {/if}
        {/if}
    
    {:else}
        {#if searchContext.loading}
            <p>Loading...</p>
        {:else if searchContext.results.users === null}
            <p>Make a search to view results!</p>
        {:else if searchContext.results.users.error !== null}
            <p>Error: {searchContext.results.users.error.message}</p>
        {:else if searchContext.results.users.data !== null}
            {#if searchContext.results.users.data.content.length == 0}
                <h2>No users were found!</h2>
            {:else}
                <h2>Found users:</h2>
                {#each searchContext.results.users.data.content as user}
                    <UserCard {user} />
                {/each}
            {/if}
        {/if}
    {/if}
</div>
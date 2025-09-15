<script lang="ts">
    import { searchRestaurants } from "$lib/core/actions/searches/search-restaurant";
    import { searchUsers } from "$lib/core/actions/searches/search-user";
    import { createSearchRune } from "$lib/core/runes/search-rune";
    import RestaurantCard from "./cards/RestaurantCard.svelte";
    import UserCard from "./cards/UserCard.svelte";
    import type ComboBoxEntry from "$lib/core/types/combo-box-entry";

    let { searchingFor = $bindable() }: { searchingFor: ComboBoxEntry } = $props();

    const restaurantSearch = createSearchRune(searchRestaurants);
    const userSearch = createSearchRune(searchUsers);

    const currentSearch = $derived(() => {
        switch (searchingFor.value) {
            case 'restaurant': return restaurantSearch;
            case 'user': return userSearch;
            default: return null;
        }
    });

    $effect(() => {
        searchingFor.value;
        restaurantSearch.clear();
        userSearch.clear();
    });

    function handleSearch(query: string) {
        const search = currentSearch();
        if (search) {
            search.search(query);
        }
    }
</script>

<div class="flex flex-col justify-start items-start p-4 gap-2">
    <div class="flex justify-between items-center w-full pb-4">
        <h1 class="font-alegreya text-2.5xl">Search on yami for {searchingFor.name}</h1>
        <input 
            type="text" 
            placeholder="Enter search query..." 
            onkeydown={(e) => {
                if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                }
            }}
        />
    </div>

    {#if searchingFor.value === 'food'}
        <p>searching for food</p>
    {:else}
        {@const search = currentSearch()}
        {#if search}
            {#if search.isLoading}
                <p>Loading...</p>
            {:else if !search.results}
                <p>Make a search to view results!</p>
            {:else if search.results.data === null}
                {#if search.results.error !== null}
                    <p>Error: {search.results.error.message}</p>
                {:else}
                    <p>An unknown error occurred. This shouldn't be possible.</p>
                {/if}
            {:else if search.results.data.content.length === 0}
                <h2>No {searchingFor.name} were found!</h2>
            {:else}
                <h2>Found {searchingFor.name}:</h2>
                {#if searchingFor.value === 'restaurant'}
                    {#each search.results.data.content as restaurant}
                        <RestaurantCard {restaurant} />
                    {/each}
                {:else if searchingFor.value === 'user'}
                    {#each search.results.data.content as user}
                        <UserCard {user} />
                    {/each}
                {/if}
            {/if}
        {/if}
    {/if}
</div>
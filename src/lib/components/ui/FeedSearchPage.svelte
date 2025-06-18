<script lang="ts">
    import type ComboBoxEntry from "$lib/core/types/comboBoxEntry";
    import { Search } from "@lucide/svelte";
    import ComboBox from "./controls/ComboBox.svelte";
    import TextField from "./controls/TextField.svelte";
    import { onMount } from "svelte";
    import { searchUsers, searchUserStore } from "$lib/core/actions/searches/searchUser";
    import ErrorSnackbar from "./ErrorSnackbar.svelte";
    import UserCard from "./cards/UserCard.svelte";
    import { searchingFor } from "$lib/core/store/searchingForStore";
    import { searchRestaurantStore } from "$lib/core/actions/searches/searchRestaurant";
    import RestaurantCard from "./cards/RestaurantCard.svelte";

</script>

<div class="flex flex-col justify-start items-start p-4 gap-2">
    <div class="flex justify-between items-center w-full pb-4">
        <h1 class="font-alegreya text-2.5xl">Search on yami for {$searchingFor.name}</h1>
    </div>
    {#if $searchingFor.value === 'restaurant'}
     
        {#if $searchRestaurantStore.loading}
        <p>Loading...</p>
        {:else if $searchRestaurantStore.data === null && !$searchRestaurantStore.loading}
            <p>Make a search to view results!</p>
        {:else if $searchRestaurantStore.error !== null}
            <p>Error: {$searchRestaurantStore.error.status}</p>
        {:else if $searchRestaurantStore.data !== null}
            {#if $searchRestaurantStore.data.content.length == 0}
                <h2>No restaurants were found!</h2>
            {:else}
                <h2>Found restaurants:</h2>
                {#each $searchRestaurantStore.data.content as restaurant }
                    <RestaurantCard {restaurant} />
                {/each}
            {/if}
        {/if}

    {:else if $searchingFor.value === 'food'}
        
        <p>searching for food</p>
    
    {:else}

        {#if $searchUserStore.loading}
            <p>Loading...</p>
        {:else if $searchUserStore.data === null && !$searchUserStore.loading}
            <p>Make a search to view results!</p>
        {:else if $searchUserStore.error !== null}
            <p>Error: {$searchUserStore.error.status}</p>
        {:else if $searchUserStore.data !== null}
            {#if $searchUserStore.data.content.length == 0}
                <h2>No users were found!</h2>
            {:else}
                <h2>Found users:</h2>
                {#each $searchUserStore.data.content as user }
                    <UserCard user={user} />
                {/each}
            {/if}
        {/if}

    {/if}
</div>
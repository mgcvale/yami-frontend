<script lang="ts">
    import type ComboBoxEntry from "$lib/core/types/comboBoxEntry";
    import { Search } from "@lucide/svelte";
    import ComboBox from "./controls/ComboBox.svelte";
    import TextField from "./controls/TextField.svelte";
    import { onMount } from "svelte";
    import { searchUsers, searchUserStore } from "$lib/core/actions/searches/searchUser";
    import ErrorSnackbar from "./ErrorSnackbar.svelte";
    import UserCard from "./cards/UserCard.svelte";

    let searchTextField: HTMLInputElement | null = $state(null);
    let searchFor: ComboBoxEntry = $state({
        name: "Users",
        value: "users",
    });

    let searchQuery = $state("");
    
    function doSearch() {
        searchTextField?.blur();
        searchUsers(searchQuery);
    }

</script>

<div class="flex flex-col justify-start items-start p-4 gap-2">
    <div class="flex justify-between items-center w-full pb-4">
        <h1 class="font-alegreya text-2.5xl">Search on yami</h1>
    </div>
    
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
</div>
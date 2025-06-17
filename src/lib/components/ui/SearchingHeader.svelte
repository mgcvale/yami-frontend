<script lang="ts">
    import { goto } from "$app/navigation";
    import { searchUsers } from "$lib/core/actions/searches/searchUser";
    import { isSearching } from "$lib/core/store/isSearchingStore";
    import { ChevronLeft, Search } from "@lucide/svelte";
    import { onMount } from "svelte";

    let inputInstance: HTMLInputElement | null = $state(null);

    onMount(() => {
        if (inputInstance !== null) inputInstance.focus();
    });

    function doSearch() {
        if (inputInstance) {
            searchUsers(inputInstance.value);
        }
    }

</script>

<header 
    class="fixed top-0 -translate-x-1/2 left-1/2 w-full max-w-[500px] h-16 flex justify-center items-center px-3 py-3 pr-4 gap-4 rounded-b-lg
     dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500 z-50"
>
    <ChevronLeft aria-label="back-button" role="button" onclick={() => {
        isSearching.set(false);
        goto("/app?context=feed")
    }}>
    </ChevronLeft>

    <input bind:this={inputInstance} type="text" placeholder="Search Yami" class="grow h-full rounded-lg bg-light-field-bg dark:bg-dark-field-bg p-2 pl-3 outline-none">

    <Search aria-label="search-button" role="button" onclick={doSearch}></Search>
</header>

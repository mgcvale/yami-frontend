<script lang="ts">
    import { Home, PlusCircle, User } from '@lucide/svelte';
    import { page } from '$app/state';
    import { Modal } from '$lib';
    import { goto } from '$app/navigation';
    import SnackBar from '$lib/components/util/SnackBar.svelte';
    import RegularHeader from '$lib/components/ui/RegularHeader.svelte';
    import SearchingHeader from '$lib/components/ui/SearchingHeader.svelte';
    import { setSearchContext } from '$lib/core/store/search-context.svelte';

    let { children } = $props();

    const searchContext = setSearchContext();

    let searchFor: string = $state("user");
    let isSearching: boolean = $state(false);
    let onExit: string = $state("/app?context=feed");

    $effect(() => {
        const mode = page.url.searchParams.get("context") ?? "feed";
        if (mode == "search") {
            isSearching = true;
        } else {
            isSearching = false;
            searchContext.clearResults(); 
        }

        onExit = page.url.searchParams.get("then") ?? "/app?context=feed";
        
        const searchForParam = page.url.searchParams.get("for");
        searchFor = (searchForParam === "food" || searchForParam === "restaurant") ? searchForParam : "user";
    });
</script>

{#if isSearching}
    <SearchingHeader {onExit} {searchFor}/>
{:else}
    <RegularHeader />
{/if}

<main class="pb-18 pt-16 min-h-dvh bg-light-bg dark:bg-dark-bg flex flex-col">
    {@render children()}
</main>

<Modal />
<SnackBar />

<nav
    class="fixed bottom-0 -translate-x-1/2 left-1/2 w-full max-w-[500px] h-18 flex items-center justify-center p-3 px-0 rounded-t-lg 
    dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500"
>
    <ul class="flex items-center justify-around w-full h-full text-sm">
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <button onclick={() => goto('/app', {replaceState: false})} class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname === "/app"}]}>
                <Home size=20 class="m-auto"/>
            </button>
            <span>Home</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full -translate-y-1"]} >
            <button onclick={() => goto('/app/review/create', {replaceState: false})} class={["w-16 rounded-full flex justify-center items-center align-center h-8 py-1", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3":  page.url.pathname.startsWith("/app/review/create")}]}>
                <PlusCircle size=22 class="m-auto"/>
            </button>
            <span class="text-[1.07rem]">Create</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <button onclick={() => goto('/app/user', {replaceState: false})} class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname === "/app/user"}]}>
                <User size=20 class="m-auto"/>
            </button>
            <span>Profile</span>
        </li>
    </ul>
</nav>
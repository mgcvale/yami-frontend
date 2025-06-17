<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/state";
    import { currentUserStore, modalStore, type CurrentUser } from "$lib";
    import Feed from "$lib/components/ui/Feed.svelte";
    import FeedSearchPage from "$lib/components/ui/FeedSearchPage.svelte";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
    import { isSearching } from "$lib/core/store/isSearchingStore";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import { onMount } from "svelte";

    let mode: string = $state("loading");

    function load(currentUser: AsyncState<CurrentUser>) {
        if (currentUser.loading) return;
        if (currentUser.data === null && mode === "feed") {
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "view your feed"
                }
            });
        }
    }

    onMount(() => {
        mode = page.url.searchParams.get("context") ?? "feed";
        load($currentUserStore);
    });

    $effect(() => {
        mode = page.url.searchParams.get("context") ?? "feed";
        load($currentUserStore);
    })

    currentUserStore.subscribe(changed => {
        load(changed);
    })
</script>

{#if mode === "feed"}
    {#if $currentUserStore.data === null}
        <h2>
            You can't access your feed without logging in first.
        </h2>
    {:else}
        <Feed className={""}></Feed>
    {/if}
{:else if mode === "search"}
    <FeedSearchPage />
{/if}
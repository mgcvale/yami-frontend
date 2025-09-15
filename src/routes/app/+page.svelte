<script lang="ts">
    import { goto, replaceState } from "$app/navigation";
    import { page } from "$app/state";
    import { currentUserStore, modalStore, type CurrentUser } from "$lib";
    import Feed from "$lib/components/ui/Feed.svelte";
    import FeedSearchPage from "$lib/components/ui/FeedSearchPage.svelte";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
    import type { AsyncState } from "$lib/core/model/async-state";

    let mode: string = $state("loading");

    $effect(() => {
        mode = page.url.searchParams.get("context") ?? "feed";
    })
</script>

{#if mode === "feed"}
    {#if $currentUserStore.data === null}
        <h2 class="text-center text-lg p-4">
            You must be logged in to have a feed!
        </h2>
        <h3 class="text-center text-md p-4"><a class="underline" href="/account/login">Login</a> or <a class="underline" href="/account/register">Create an account</a></h3>
    {:else}
        <Feed className={""}></Feed>
    {/if}
{:else if mode === "search"}
    <FeedSearchPage />
{/if}
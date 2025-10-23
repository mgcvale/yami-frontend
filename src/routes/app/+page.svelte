<script lang="ts">
    import { page } from "$app/state";
    import { currentUserStore } from "$lib";
    import Feed from "$lib/components/ui/Feed.svelte";
    import FeedSearchPage from "$lib/components/ui/FeedSearchPage.svelte";
    import type { CurrentUser } from "$lib/core/model/current-user";
    import type { FoodReview } from "$lib/core/model/food-review";

    let mode: string = $state("loading");

    let { data }: { data: { user: CurrentUser, feedEntries: FoodReview[] } } = $props();

    $effect(() => {
        mode = page.url.searchParams.get("context") ?? "feed";
    })
</script>

{#if mode === "feed"}
    {#if $currentUserStore.data === null}
        <h2 class="text-center text-lg p-4">
            You must be logged in to have a feed!
        </h2>
        <h3 class="text-center text-md p-4">
            <a class="underline" href="/account/login">Login</a> or 
            <a class="underline" href="/account/register">Create an account</a>
        </h3>
    {:else}
        <Feed content={data.feedEntries} className={""}></Feed>
    {/if}
{:else if mode === "search"}
    <FeedSearchPage />
{/if}
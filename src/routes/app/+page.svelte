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
            Você deve estar logado para ver seu feed!
        </h2>
        <h3 class="text-center text-md p-4">
            <a class="underline" href="/account/login">Fazer log-in</a> ou 
            <a class="underline" href="/account/register">Criar uma conta</a>
        </h3>
    {:else}
        {#if data.feedEntries.length == 0}
            <div class="flex flex-1 justify-center items-center h-full">
                <p class="p-3 px-8 text-center">Parece que seu feed está vazio! Tente dar uma olhada em alguns restaurantes populares, ou pesquise as contas de seus amigos.</p>
            </div>
        {:else}
            <Feed content={data.feedEntries} className={""}></Feed>
        {/if}
    {/if}
{:else if mode === "search"}
    <FeedSearchPage />
{/if}
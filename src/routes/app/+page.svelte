<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/state";
    import { currentUserStore, modalStore, type CurrentUser } from "$lib";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
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
        <h2>This is your feed</h2>
    {/if}
{:else if mode === "search"}
        <h2>You're searching</h2>
{/if}
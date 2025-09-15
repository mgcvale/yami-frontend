<script lang="ts">
    import { currentUserStore, modalStore, type CurrentUser } from "$lib";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
    import type { AsyncState } from "$lib/core/types/async-state";
    import { onMount } from "svelte";

    function load(currentUser: AsyncState<CurrentUser>) {
        if (currentUser.loading) return;
        if (currentUser.data === null) {
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "view your feed"
                }
            });
        }
    }

    onMount(() => {
        load($currentUserStore);
    });

    currentUserStore.subscribe(changed => {
        load(changed);
    })
</script>

{#if $currentUserStore === null}
    
{/if}
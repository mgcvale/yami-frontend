<script lang="ts">
    import { currentUserStore, modalStore } from "$lib";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        if ($currentUserStore == null) {
            modalStore.set({
                component: LoginAsker,
                props: {},
            });
        }
    });
</script>

{#if $currentUserStore === null}

{/if}
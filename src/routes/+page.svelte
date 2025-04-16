<script lang="ts">
    import { currentUserStore, modalStore } from "$lib";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        if ($currentUserStore == null) {
            modalStore.set(LoginAsker);
        }
    });
</script>

{#if $currentUserStore === null}

{/if}
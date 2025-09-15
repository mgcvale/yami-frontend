<script lang="ts">
    import { navigating } from "$app/state";
    import { onMount } from "svelte";

    let { children } = $props();


    onMount(() => {
        console.log("LOADED LAYOUT");
    })
</script>

{#if navigating.to}
    <div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
        <h2 class="w-full text-center text-xl">Loading...</h2>
    </div>
{:else}
    {@render children()}
{/if}
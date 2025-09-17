<script>
    import { navigating } from "$app/state";

    let { children } = $props();
</script>

{#if navigating.to}
    <div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
        <h2 class="w-full text-center text-xl">Loading...</h2>
    </div>
{:else}
    {@render children()}
{/if}
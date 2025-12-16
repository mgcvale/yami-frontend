<script lang="ts">
    import { navigating } from '$app/state';
    import HeaderWithBackButton from '$lib/components/ui/HeaderWithBackButton.svelte';
    let { children } = $props();


</script>

<HeaderWithBackButton title={"Avaliações que você curtiu"} />

<div class="flex flex-col w-full h-fit justify-start items-center px-4 gap-4" >
    {#if navigating.to} 
        <p>Carregando as avaliações...</p>
    {/if}
    {@render children()}
</div>
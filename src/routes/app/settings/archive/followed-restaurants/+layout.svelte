<script lang="ts">
    import { navigating } from '$app/state';
    import HeaderWithBackButton from '$lib/components/ui/HeaderWithBackButton.svelte';

    let { children } = $props();

</script>

<HeaderWithBackButton title={"Restaurantes que você segue"} />

<div class="flex flex-col w-full h-fit justify-start items-center px-4 gap-4" >
    {#if navigating.to} 
        <p>Carregando os restaurantes...</p>
    {/if}
    {@render children()}
</div>
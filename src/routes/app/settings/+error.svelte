<script lang="ts">
	import { page } from '$app/state';
    import { NETWORK_ERROR_STR } from '$lib/core/types/error-codes';
</script>

<h2 class="text-xl text-light-error dark:text-dark-error w-full text-center">
    Ocorreu um erro!
</h2>

<div class="flex flex-col justify-start items-center">
    {#if page.error!.status === 500}
        <p>Ocorreu um erro do nosso lado. Você pode tentar novamente mais tarde.</p>
        <a class="underline" href="/app">Ir para a página inicial</a>
    {:else if page.error!.type === NETWORK_ERROR_STR}
        <p>Ocorreu um erro de rede. Verifique se você está conectado à internet.</p>
    {:else}
        <p>Ocorreu um erro desconhecido.</p>
        <p>Status do erro: {page.error!.status}</p>
    {/if}
</div>

<script lang="ts">
    import { page } from "$app/state";
    import { DEFAULT_ERRORS, NETWORK_ERROR_STR } from "$lib/core/types/error-codes";
    import { onMount } from "svelte";

    let data = $props();

    onMount(() => {
        console.log(page.error);
    });
</script>

<h2 class="text-xl text-light-error dark:text-dark-error w-full text-center py-2">
    Ocorreu um erro!
</h2>

<div class="flex flex-col justify-start items-center px-4 text-center gap-1">
    {#if page.error?.status === 404}
        <p>O usuário solicitado não foi encontrado.</p>
        <a class="underline" href="/app">Ir para a página inicial</a>
    {:else if page.error?.type === NETWORK_ERROR_STR}
        <p>Ocorreu um erro de rede. Verifique se você está conectado à internet.</p>
        <a class="underline" href="/app">Ir para a página inicial</a>
    {:else if page.error?.status === 500}
        <p>Ocorreu um erro do nosso lado. Você pode tentar novamente mais tarde.</p>
        <a class="underline" href="/app">Ir para a página inicial</a>
    {:else if page.error?.status === 401}
        <p>Você precisa estar logado para visualizar esta página.</p>
        <a class="underline" href="/app">Ir para a página inicial</a>
    {:else}
        <p>Ocorreu um erro desconhecido.</p>
        <p class="text-center">Mensagem de erro: {page.error?.message}</p>
    {/if}
</div>

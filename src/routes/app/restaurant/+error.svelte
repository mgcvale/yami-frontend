<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { NETWORK_ERROR_STR } from "$lib/core/types/error-codes";
    import { onMount } from "svelte";

    onMount(() => {
        console.log(page.error);
    });
</script>

<h2 class="text-xl text-light-error dark:text-dark-error w-full text-center py-2">
    Ocorreu um erro!
</h2>

<div class="flex flex-col justify-start items-center px-4 text-center gap-1">
    {#if page.error?.type === NETWORK_ERROR_STR}
        <p>Ocorreu um erro de rede. Verifique se você está conectado à internet.</p>
        <a class="underline" href="/app">Ir para a página inicial</a>
    {:else if page.error?.status == 404}
        <p>O restaurante que você está procurando não existe.</p>
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

    <button class="underline py-2" onclick={() => goto(page.url.href, { invalidateAll: true })}>
        Tentar novamente
    </button>
</div>

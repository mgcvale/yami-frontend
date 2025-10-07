<script lang="ts">
    import { page } from "$app/state";
    import { DEFAULT_ERRORS, NETWORK_ERROR_STR } from "$lib/core/types/error-codes";
    import { onMount } from "svelte";

    let data = $props();

    onMount(() => {
        console.log(page.error);
    });
</script>

<h2 class="text-xl text-light-error dark:text-dark-error w-full text-center py-2">An error occurred!</h2>
<div class="flex flex-col justify-start items-center px-4 text-center gap-1">
    {#if page.error?.status === 404}
        <p>The user you requested wasn't found.</p>
        <a class="underline" href="/app">Go to home</a>
    {:else if page.error?.type === NETWORK_ERROR_STR}
        <p>A network error occurred. Check if you're connected to the internet.</p>
        <a class="underline" href="/app">Go to home</a>
    {:else if page.error?.status === 500}
        <p>An error occurred on our end. You can try again later.</p>
        <a class="underline" href="/app">Go to home</a>
    {:else if page.error?.status === 401}
        <p>You must be logged in to view this page.</p>
        <a class="underline" href="/app">Go to home</a>
    {:else}
        <p>An unknown error occurred.</p>
        <p class="text-center">Error message: {page.error?.message}</p>
    {/if}
</div>

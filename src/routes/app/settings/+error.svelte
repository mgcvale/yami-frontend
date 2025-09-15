<script lang="ts">
	import { page } from '$app/state';
    import { NETWORK_ERROR_STR } from '$lib/core/types/errorCodes';

</script>

<h2 class="text-xl text-light-error dark:text-dark-error w-full text-center">An error occurred!</h2>
<div class="flex flex-col justify-start items-center">
    {#if page.error!.status === 500}
        <p>An error occurred on our end. You can try again later.</p>
        <a class="underline" href="/app">Go to home</a>
    {:else if page.error!.type === NETWORK_ERROR_STR}
        <p>A network error occurred. Check if you're connected to the internet</p>
    {:else}
        <p>An unknown error occurred.</p>
        <p>Error status: {page.error!.status}</p>
    {/if}
</div>


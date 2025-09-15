<script lang="ts">
	import { page } from '$app/state';
    import { onMount } from 'svelte';

    onMount(() => {
        console.log(page.error);
    });

</script>

<h2 class="text-xl text-light-error dark:text-dark-error w-full text-center">An error occurred!</h2>
<div class="flex flex-col justify-start items-center">
    {#if page.error!.status === 404}
        <p>The user you requested wasn't found.</p>
        <a class="underline" href="/app">Go to home</a>
    {:else if page.error!.status === 500}
        <p>An error occurred on our end. You can try again later.</p>
        <a class="underline" href="/app">Go to home</a>
    {:else}
        <p>An unknown error occurred.</p>
        <p class="text-center">Error status: {page.error?.message}</p>
    {/if}
</div>


<script lang="ts">
    import { load } from '$lib/core/actions/account/loadFromToken';
    import { onMount } from 'svelte';
    import '../app.css';
    import { loadAppState } from '$lib/core/util/appState';
    import { initializeThemeManager } from '$lib/core/util/themeManager';
    export const prerender = false;

    let { children } = $props();
    load();
    
    onMount(() => {
        initializeThemeManager(document);
        loadAppState(document);
    })
    
</script>
<div class="yami-content h-full w-full max-w-[500px] bg-light-bg dark:bg-dark-bg">
    {@render children()}
</div>
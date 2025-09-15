<script lang="ts">
    import { loadUserFromToken } from '$lib/core/actions/account/auth-from-token';
    import { onMount } from 'svelte';
    import '../app.css';
    import { loadAppState } from '$lib/core/util/app-state';
    import { initializeThemeManager } from '$lib/core/util/theme-manager';
    export const prerender = false;

    let { children } = $props();
    
    onMount(() => {
        initializeThemeManager(document);
        loadAppState(document);
    })
    
</script>
<div class="yami-content h-full w-full max-w-[500px] bg-light-bg dark:bg-dark-bg">
    {@render children()}
</div>
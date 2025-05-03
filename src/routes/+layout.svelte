<script lang="ts">
    import { load } from '$lib/core/actions/account/loadFromToken';
    import { onMount } from 'svelte';
    import '../app.css';
    import { loadAppState } from '$lib/core/util/appState';
    import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
    import { initializeThemeManager } from '$lib/core/util/themeManager';
    import { snackbarStore } from '$lib/core/store/snackbarStore';
    import ErrorSnackbar from '$lib/components/ui/ErrorSnackbar.svelte';
    export const prerender = false;

    let { children } = $props();
    load();
    onMount(() => {
        initializeThemeManager(document);
        loadAppState(document);
    })
    
</script>

{@render children()}
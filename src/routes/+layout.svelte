<script lang="ts">
    import { load } from '$lib/core/actions/account/loadFromToken';
    import { onMount } from 'svelte';
    import '../app.css';
    import { loadAppState } from '$lib/core/util/appState';
    import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
    export const prerender = false;

    let { children } = $props();
    load();
    onMount(() => {
        loadAppState(document);
    })
    
</script>

{@render children()}
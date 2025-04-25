<script lang="ts">
    import { load } from '$lib/core/actions/account/loadFromToken';
    import '../app.css';
    let { children } = $props();

    export const prerender = false;

    load();
</script>

{@render children()}
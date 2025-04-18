<script lang="ts">
    import { load } from '$lib/core/actions/account/loadFromToken';
    import '../app.css';
    let { children } = $props();

    export const ssr = false;
    export const prerender = false;

    load();

</script>

{@render children()}
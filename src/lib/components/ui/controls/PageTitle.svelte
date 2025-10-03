<script lang="ts">
    let { children, className="" } = $props();
</script>

<h1 class="font-alegreya text-3xl p-4 {className}">{@render children()}</h1>

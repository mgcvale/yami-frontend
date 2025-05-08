<script lang="ts">
    let { children } = $props();
</script>

<main class="w-full max-w-[500px] max-h-dvh h-dvh flex flex-col justify-center items-center gap-4">
    
    {@render children()}

</main>
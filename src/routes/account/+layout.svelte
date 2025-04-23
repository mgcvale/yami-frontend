<script lang="ts">
    import Logo from "$lib/components/ui/Logo.svelte";

    let { children } = $props();
</script>

<main class="w-dvw max-h-dvh h-dvh flex flex-col justify-center items-center gap-4">
    
    {@render children()}

</main>
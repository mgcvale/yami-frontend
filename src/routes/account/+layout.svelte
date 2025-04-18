<script lang="ts">
    import Logo from "$lib/components/ui/Logo.svelte";

    let { children } = $props();
</script>

<main class="w-dvw h-dvh flex flex-col justify-center items-center gap-4">
    
    {@render children()}

</main>
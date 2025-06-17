<script lang="ts">
    let { children, className="" } = $props();
</script>

<div class="w-5/6 h-fit bg-light-card-1 dark:bg-dark-card-1 p-4 rounded-2xl {className}">
   {@render children()}
</div>
<script lang="ts">
    let { children, className="" } = $props();
</script>

<div class="w-5/6 h-fit bg-light-card-2 dark:bg-dark-card-2 p-4 rounded-2xl {className}">
   {@render children()}
</div>
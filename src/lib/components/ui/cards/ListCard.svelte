<script lang="ts">
    let { children, className="" } = $props();
</script>

<div class="w-full h-fit bg-light-card-2 dark:bg-dark-card-1 p-4 pt-2 items-start flex flex-col gap-2 jutsify-start rounded-2xl {className}">
   {@render children()}
</div>
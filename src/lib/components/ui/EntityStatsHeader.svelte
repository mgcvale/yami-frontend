<script lang="ts">
    import type { EntityStat } from "$lib/core/types/entity-stat";

    let { className = "", name, headers, pictureUrl }: {
        className: string,
        name: string,
        headers: EntityStat[],
        pictureUrl: string,
    } = $props();
</script>

<div class="flex justify-around items-center h-24 {className}">
    <img src={pictureUrl} alt={`${name}'s profile picture`} class="h-full w-auto block rounded-full" >
    {#each headers as header}
        <div class="flex flex-col justify-around items-center">
            <p class="text-light-fg-50 dark:text-dark-fg-50 font-extrabold {header.countClassName}">{header.count}</p>
            <h3 class="font-medium {header.nameClassName}">{header.name}</h3>
        </div>
    {/each}
</div>
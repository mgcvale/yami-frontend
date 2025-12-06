<script lang="ts">
    import type { SearchDropdownItem } from "$lib/core/types/search-dropdown-item";
    import { Image } from "@lucide/svelte";


    let {
        imageUrlFunction, selectItem, item = $bindable()
    }: {
        imageUrlFunction: (id: number) => string,
        selectItem: (item: SearchDropdownItem) => void,
        item: SearchDropdownItem
    } = $props();

</script>

<button class="w-full h-12 flex justify-start items-center p-2 bg-light-card-2 dark:bg-dark-card-2 rounded-md gap-2" onclick={() => selectItem(item)}>
    {#if !item.imageError}
        <img class="h-full w-auto aspect-square rounded-full" src={imageUrlFunction(item.id)} alt="img" onerror={() => item.imageError = true}>
    {:else}
        <div class="w-12">
            <Image size={24} />
        </div>
    {/if}
    <div class="flex flex-col justify-center items-start overflow-hidden">
        <span>
            {item.text}
        </span>
        <span class="text-sm truncate overflow-ellipsis w-full pr-2 max-w-full">
            {item.subtext}
        </span>
    </div>
</button>
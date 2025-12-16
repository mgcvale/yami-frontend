<script lang="ts">
    import config from "$lib/config";
    import EntityStatsHeader from "./EntityStatsHeader.svelte";
    import type { Restaurant } from "$lib/core/model/restaurant";
    import Button from "./controls/Button.svelte";

    let { data }: {data: Restaurant} = $props();
</script>

<EntityStatsHeader 
    className='h-24'
    name={data.name}
    pictureUrl={config.apiPaths.restaurantImage(data.id)}
    headers={[
        {
            name: "Reviews",
            nameClassName: "text-ml",
            count: data.reviewCount,
            countClassName: "text-lg"
        },
        {
            name: "Foods",
            nameClassName: "text-ml",
            count: data.foodCount,
            countClassName: "text-lg"
        },
        {
            name: "Followers",
            nameClassName: "text-sm text-light-fg-700 dark:text-dark-fg-700",
            count: -1,
            countClassName: "text-md"
        }
    ]}
/>
<div class="flex flex-col justify-start items-start text-start">
    <h2 class="text-light-fg-50 dark:text-dark-fg-50 text-xl font-bold font-alegreya mx-1">
        @{data.shortName}
    </h2>
    <h4 class="text-md font-dm-sans text-light-fg-300 dark:text-dark-fg-300 text-ms mx-1">
        {data.name}
        {#if data.location !== undefined && data.location.trim() !== ""}
            <span class="text-sm text-light-fg-700 dark:text-dark-fg-700">• From <span>{data.location}</span></span>
        {/if}
    </h4>
    <h4 class="text-md font-dm-sans text-light-fg-500 dark:text-dark-fg-500 text-ms mx-1">
        {data.description}
    </h4>
    <Button className="w-full rounded-ml py-0.5 mt-2">
        Seguir
    </Button>
</div>
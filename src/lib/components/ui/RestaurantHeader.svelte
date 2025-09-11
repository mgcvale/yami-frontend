<script lang="ts">
    import config from "$lib/config";
    import EntityStatsHeader from "./EntityStatsHeader.svelte";
    import RestaurantTitleHeader from "./RestaurantTitleHeader.svelte";
    import type Restaurant from "$lib/core/model/restaurant";

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
            nameClassName: "text-ml text-light-fg-500 dark:text-dark-fg-500",
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
<RestaurantTitleHeader {data} />
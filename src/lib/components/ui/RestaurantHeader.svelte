<script lang="ts">
    import config from "$lib/config";
    import { loadRestaurantStore } from "$lib/core/actions/restaurant/loadRestaurant";
    import EntityStatsHeader from "./EntityStatsHeader.svelte";
    import RestaurantTitleHeader from "./RestaurantTitleHeader.svelte";

</script>

{#if $loadRestaurantStore.data !== null}
    <EntityStatsHeader 
        className='h-24'
        name={$loadRestaurantStore.data.name}
        pictureUrl={config.apiPaths.restaurantImage($loadRestaurantStore.data.id)}
        headers={[
            {
                name: "Reviews",
                nameClassName: "text-ml",
                count: $loadRestaurantStore.data.reviewCount,
                countClassName: "text-lg"
            },
            {
                name: "Foods",
                nameClassName: "text-ml text-light-fg-500 dark:text-dark-fg-500",
                count: $loadRestaurantStore.data.foodCount,
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
    <RestaurantTitleHeader />
{/if}
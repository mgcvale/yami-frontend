<script lang="ts">
    import { goto } from "$app/navigation";
    import config from "$lib/config";
    import { searchRestaurantStore } from "$lib/core/actions/searches/searchRestaurant";
    import type Restaurant from "$lib/core/model/restaurant";

    let { 
        restaurant,
    }: {
        restaurant: Restaurant,
    } = $props();

</script>


<button onclick={() => {
        goto(`/app/restaurant?id=${restaurant.id}`);
        searchRestaurantStore.set({
            loading: false,
            data: null,
            error: null
        });
    }
} class="w-full h-fit bg-light-card-2 hover:bg-light-card-3 dark:hover:bg-dark-card-2 active:bg-light-card-3 dark:active:bg-dark-card-2 dark:bg-dark-card-1 p-2 px-4 items-start flex flex-col gap-2 jutsify-start rounded-2xl cursor-pointer"
>
    <div class="flex justify-start items-center gap-2 h-10 pt-1">
        <img class="h-full w-auto block rounded-full" src={config.apiPaths.restaurantImage(restaurant.id)} alt="restaurant">
        <h3 class="text-lg">{restaurant.shortName}</h3>
        <span class="text-sm text-light-fg-700 dark:text-dark-fg-700"><span>{restaurant.name}</span></span>
    </div>
    <p class="text-start text-sm text-light-fg-700 dark:text-dark-fg-700">
        {restaurant.description}
    </p>
</button>
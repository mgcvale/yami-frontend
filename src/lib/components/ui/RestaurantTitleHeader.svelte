<script lang="ts">
    import { loadRestaurantStore } from "$lib/core/actions/restaurant/loadRestaurant";
    import Button from "./controls/Button.svelte";


</script>
{#if $loadRestaurantStore.data !== null}
    <div class="flex flex-col justify-start items-start text-start">
        <h2 class="text-light-fg-50 dark:text-dark-fg-50 text-xl font-bold font-alegreya mx-1">
            @{$loadRestaurantStore.data.shortName}
        </h2>
        <h4 class="text-md font-dm-sans text-light-fg-300 dark:text-dark-fg-300 text-ms mx-1">
            {$loadRestaurantStore.data.name}
            {#if $loadRestaurantStore.data.location !== undefined && $loadRestaurantStore.data.location.trim() !== ""}
                <span class="text-sm text-light-fg-700 dark:text-dark-fg-700">• From <span>{$loadRestaurantStore.data.location}</span></span>
            {/if}
        </h4>
        <h4 class="text-md font-dm-sans text-light-fg-500 dark:text-dark-fg-500 text-ms mx-1">
            {$loadRestaurantStore.data.description}
        </h4>
        <Button className="w-full rounded-ml py-0.5 mt-2">
            {"Follow"}
        </Button>
    </div>
{/if}
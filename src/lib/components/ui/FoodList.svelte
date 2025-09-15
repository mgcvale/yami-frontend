<script lang="ts">
    import type { Food } from "$lib/core/model/food";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { onMount } from "svelte";
    import FoodCard from "./cards/FoodCard.svelte";
    import { loadFoods } from "$lib/core/actions/food/loadFoods";
    import Button from "./controls/Button.svelte";

    let {
        restaurantId
    }: {
        restaurantId: number
    } = $props();

    let loading = $state(true);
    let foods = $state<SyncState<Food[]>>(null);

    async function load() {
        loading = true;
        foods = await loadFoods(restaurantId);
        loading = false;
    }

    onMount(async () => load());
</script>

<div class="flex flex-col gap-4">
    {#if loading}
        <p>Loading</p>
    {:else}
        {#if foods.error !== null}
            <h2>An error ocurred while loading this restaurant's foods: {foods.error.message}</h2>
            <div class="flex justify-center w-full">
                <Button onclick={load}>Reload Restaurant</Button>
            </div>
        {:else}
            {#each foods.data! as food}
                <FoodCard {food} />
            {/each}
        {/if}
    {/if}
</div>
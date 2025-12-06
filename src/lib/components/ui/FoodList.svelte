<script lang="ts">
    import type { Food } from "$lib/core/model/food";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { onMount } from "svelte";
    import FoodCard from "./cards/FoodCard.svelte";
    import { loadFoods, loadFoodsSearching } from "$lib/core/actions/food/load-foods";
    import Button from "./controls/Button.svelte";
    import TextField from "./controls/TextField.svelte";
    import { Search } from "@lucide/svelte";
    import { syncSuccess } from "$lib/core/actions/util";

    let {
        restaurantId
    }: {
        restaurantId: number
    } = $props();

    let loading = $state(true)
    let allFoods: Food[]  = [];
    let foods = $state<SyncState<Food[]>>(syncSuccess([]));
    let query = $state("");

    async function load() {
        loading = true;
        console.log("LOADING NORMALLY");
        foods = await loadFoods(restaurantId);
        allFoods = foods.data ?? [];
        loading = false;
    }

    function doSearch() {
        if (loading) return;

        foods.data = allFoods.filter(food => {
            return (food.name.toLowerCase().includes(query.toLowerCase()))
        });
    }

    onMount(async () => load());
</script>

<div class="flex flex-col gap-4">
    <TextField bind:value={query} placeholder={"Search foods"} icon={Search} noDecoration={true} onIconClick={doSearch} onSubmit={doSearch} onKeyPress={doSearch}
    ></TextField>
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
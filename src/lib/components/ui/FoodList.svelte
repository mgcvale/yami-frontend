<script lang="ts">
    import type Food from "$lib/core/model/food";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import FoodCard from "./cards/FoodCard.svelte";


    let {
        foods = $bindable()
    }: {
        foods: AsyncState<Food[]>
    } = $props();

</script>

<div class="flex flex-col gap-4">
    {#if foods.data !== null}
        {#each foods.data as food}
            <FoodCard {food} />
        {/each}
    {/if}
</div>
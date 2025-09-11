<script lang="ts">
    import TabControl from "$lib/components/ui/controls/TabControl.svelte";
    import FoodList from "$lib/components/ui/FoodList.svelte";
    import RestaurantHeader from "$lib/components/ui/RestaurantHeader.svelte";
    import { loadFoodsStore } from "$lib/core/actions/food/loadFoods";
    import type TabControlEntry from "$lib/core/types/tabControlEntry";
    import { NotebookPen, Sandwich } from "@lucide/svelte";
    import type { PageProps } from "../$types";

    const pageOptions: TabControlEntry[] = [
        {
            name: "Foods",
            value: "foods",
            icon: Sandwich
        },
        {
            name: "Reviews",
            value: "reviews",
            icon: NotebookPen
        }
    ];

    let currentOption: TabControlEntry = $state(pageOptions[0]);

    let { data }: PageProps = $props();
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
        <RestaurantHeader data={data} />
        <TabControl entries={pageOptions} className={"mb-2"} bind:currentEntry={currentOption} />
        {#if currentOption.value === "reviews"}
            <p>reviews </p>
        {:else}
            <FoodList bind:foods={$loadFoodsStore} />
        {/if}
</div>
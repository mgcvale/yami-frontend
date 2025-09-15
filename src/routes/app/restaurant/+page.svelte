<script lang="ts">
    import TabControl from "$lib/components/ui/controls/TabControl.svelte";
    import FoodList from "$lib/components/ui/FoodList.svelte";
    import RestaurantHeader from "$lib/components/ui/RestaurantHeader.svelte";
    import type TabControlEntry from "$lib/core/types/tab-control-entry";
    import { NotebookPen, Sandwich } from "@lucide/svelte";
    import type { PageData } from "../$types";

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

    let { data } = $props() ;
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
    <RestaurantHeader data={data.restaurant} />
    <TabControl entries={pageOptions} className={"mb-2"} bind:currentEntry={currentOption} />
    {#if currentOption.value === "reviews"}
        <p>reviews </p>
    {:else}
        <FoodList restaurantId={data.restaurantId} />
    {/if}
</div>
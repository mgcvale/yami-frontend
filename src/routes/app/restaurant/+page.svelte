<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import TabControl from "$lib/components/ui/controls/TabControl.svelte";
    import FoodList from "$lib/components/ui/FoodList.svelte";
    import FoodReviewList from "$lib/components/ui/FoodReviewList.svelte";
    import RestaurantHeader from "$lib/components/ui/RestaurantHeader.svelte";
    import type { Restaurant } from "$lib/core/model/restaurant";
    import type TabControlEntry from "$lib/core/types/tab-control-entry";
    import { NotebookPen, Sandwich } from "@lucide/svelte";
    import { onMount } from "svelte";

    const pageOptions: TabControlEntry[] = [
        {
            name: "Pratos",
            value: "foods",
            icon: Sandwich
        },
        {
            name: "Avaliações",
            value: "reviews",
            icon: NotebookPen
        }
    ];

    let currentOption: TabControlEntry = $state(pageOptions[0]);
    
    $effect(() => {
        const url = new URL(window.location.href);
        const currentParam = url.searchParams.get("page");

        if (currentParam !== currentOption.value) {
            url.searchParams.set("page", currentOption.value);
            window.history.replaceState({}, "", url);
        }
    });


    onMount(() => {
        if (data.page == "foods") {
            currentOption = pageOptions[0];
        } else {
            currentOption = pageOptions[1];
        }
    })

    let { data }: { data: { restaurant: Restaurant, restaurantId: number, page: "foods" | "reviews" } } = $props();
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
    <RestaurantHeader data={data.restaurant} />
    <TabControl entries={pageOptions} className={"mb-2"} bind:currentEntry={currentOption} />
    {#if currentOption.value === "reviews"}
        <FoodReviewList className="" id={data.restaurantId} userReviews={false} viewingSelf={false} />
    {:else}
        <FoodList restaurantId={data.restaurantId} />
    {/if}
</div>
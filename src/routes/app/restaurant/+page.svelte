<script lang="ts">
    import { page } from "$app/state"; 
    import TabControl from "$lib/components/ui/controls/TabControl.svelte";
    import FoodList from "$lib/components/ui/FoodList.svelte";
    import RestaurantHeader from "$lib/components/ui/RestaurantHeader.svelte";
    import { loadFoods, loadFoodsStore } from "$lib/core/actions/food/loadFoods";
    import { loadRestaurant, loadRestaurantStore } from "$lib/core/actions/restaurant/loadRestaurant";
    import type TabControlEntry from "$lib/core/types/tabControlEntry";
    import { NotebookPen, Sandwich } from "@lucide/svelte";

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

    function load(id: string) {
        loadRestaurant(parseInt(id));
        loadFoods(parseInt(id));
    }

    $effect(() => {
        const id: string | null = page.url.searchParams.get('id');
        if (id === null) {
            console.log("ID IS NULL");
            return;
        }
        load(id);
    });

    
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
    {#if $loadRestaurantStore.loading}
        <h2 class="w-full text-center text-xl">Loading...</h2>
    {:else}
        {#if $loadRestaurantStore.data === null}

            {#if $loadRestaurantStore.error !== null}
                <h2 class="text-xl text-light-error dark:text-dark-error w-full text-center">An error occurred!</h2>
                {#if $loadRestaurantStore.error.status === 404}
                    <p>The user you requested wasn't found.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if $loadRestaurantStore.error.status === 500}
                    <p>An error occurred on our end. You can try again later.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if $loadRestaurantStore.error instanceof TypeError}
                    <p>A network error occurred. Check if you're connected to the internet</p>
                {:else}
                    <p>An unknown error occurred.</p>
                    <p>Error status: {$loadRestaurantStore.error.status}</p>
                {/if}
            {:else}
                <h2 class="text-xl font-alegreya">An unknown error occurred!</h2>
            {/if}

        {:else}
            <RestaurantHeader />
            <TabControl entries={pageOptions} className={"mb-2"} bind:currentEntry={currentOption} />
            {#if currentOption.value === "reviews"}
                <p>reviews </p>
            {:else}
                <FoodList bind:foods={$loadFoodsStore} />
            {/if}
        {/if}
    {/if}
</div>
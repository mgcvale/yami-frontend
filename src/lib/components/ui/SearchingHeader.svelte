<script lang="ts">
    import { goto } from "$app/navigation";
    import { searchUsers } from "$lib/core/actions/searches/searchUser";
    import { isSearching } from "$lib/core/store/isSearchingStore";
    import type ComboBoxEntry from "$lib/core/types/comboBoxEntry";
    import { ChevronLeft, Search, User, MapPinHouse, Sandwich } from "@lucide/svelte";
    import TextComboBox from "./controls/TextComboBox.svelte";
    import { page } from "$app/stores";

    let {
        searchFor = $bindable("user"),
    }: {
        searchFor: string
    } = $props();

    const comboItems = [
        {
            name: "User",
            icon: User,
            value: "user"
        },
        {
            name: "Food",
            icon: Sandwich,
            value: "food"
        },
        {
            name: "Restaurant",
            icon: MapPinHouse,
            value: "restaurant",
        },
    ];

    let inputElement: HTMLInputElement | null = $state(null);
    let searchQuery: string = $state("");
    let currentItem: ComboBoxEntry = $state(comboItems[0]);

    $effect(() => {
        setTimeout(() => inputElement?.focus());
    });

    $effect(() => {
        currentItem = comboItems[{
            "restaurant": 2,
            "food": 1,
        }[searchFor] ?? 0];
    });

    $effect(() => {
        $page.url.searchParams.set("for", currentItem.value); 
    });
    
    function doSearch() {
        if (inputElement) {
            searchUsers(inputElement.value);
        }
    }
</script>

<header 
    class="fixed top-0 -translate-x-1/2 left-1/2 w-full max-w-[500px] h-16 flex justify-center items-center px-3 py-3 pr-4 gap-4 rounded-b-lg
     dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500 z-50"
>
    <ChevronLeft aria-label="back-button" role="button" onclick={() => {
        isSearching.set(false);
        goto("/app?context=feed")
    }}>
    </ChevronLeft>

    <TextComboBox
        items={comboItems}
        placeholder={`Search for ${currentItem.name}`}
        bind:value={searchQuery}
        bind:currentItem={currentItem}
        className={"w-full h-full px-3"}
        bind:inputElement={inputElement}
    />

    <Search aria-label="search-button" role="button" onclick={doSearch}></Search>
</header>

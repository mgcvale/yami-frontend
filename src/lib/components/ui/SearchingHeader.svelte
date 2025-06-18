<script lang="ts">
    import { goto } from "$app/navigation";
    import { searchUsers } from "$lib/core/actions/searches/searchUser";
    import { ChevronLeft, Search, User, MapPinHouse, Sandwich } from "@lucide/svelte";
    import TextComboBox from "./controls/TextComboBox.svelte";
    import { searchRestaurants } from "$lib/core/actions/searches/searchRestaurant";
    import { searchingFor, searchOptions } from "$lib/core/store/searchingForStore";

    let {
        searchFor = $bindable("user"),
    }: {
        searchFor: string
    } = $props();

    let inputElement: HTMLInputElement | null = $state(null);
    let searchQuery: string = $state("");

    $effect(() => {
        setTimeout(() => inputElement?.focus());
    });

    $effect(() => {
        inputElement?.addEventListener('keyup', e => {
            if (e.key == 'Enter') {
                e.preventDefault();
                doSearch();
                inputElement?.blur();
            }
        });
    })
    
    function doSearch() {
        if (inputElement) {
            ({
                "restaurant": searchRestaurants,
            }[$searchingFor.value] ?? searchUsers)(inputElement.value);
        }
    }
</script>

<header 
    class="fixed top-0 -translate-x-1/2 left-1/2 w-full max-w-[500px] h-16 flex justify-center items-center px-3 py-3 pr-4 gap-4 rounded-b-lg
     dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500 z-50"
>
    <ChevronLeft aria-label="back-button" role="button" onclick={() => {
        goto("/app?context=feed")
    }}>
    </ChevronLeft>

    <TextComboBox
        items={Object.values(searchOptions)}
        placeholder={`Search for ${$searchingFor.name}`}
        bind:value={searchQuery}
        bind:currentItem={$searchingFor}
        className={"w-full h-full px-3"}
        bind:inputElement={inputElement}
    />

    <Search aria-label="search-button" role="button" onclick={doSearch}></Search>
</header>

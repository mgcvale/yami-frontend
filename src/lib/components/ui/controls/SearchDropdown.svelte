<script lang="ts">
    import type ComboBoxEntry from "$lib/core/types/combo-box-entry";
    import { Search, X, Check } from "@lucide/svelte";
    import { type SearchDropdownItem } from "$lib/core/types/search-dropdown-item";
    import { type SyncState } from "$lib/core/model/sync-state";
    import { onDestroy } from "svelte";

    let loadingData = $state(false);
    let loadedData = $state<SyncState<SearchDropdownItem[]>>({
        data: null,
        error: null,
    });
    let lastValue = "";

    let {
        fetchFunction,
        imageAddressFunction,
        value = $bindable(""),
        placeholder = "",
        className = "",
        inputElement = $bindable(null),
        selected = $bindable(null),
    }: {
        fetchFunction: (
            query: string,
        ) => Promise<SyncState<SearchDropdownItem[]>>;
        imageAddressFunction: (id: number) => string;
        value: string;
        placeholder: string;
        className: string;
        inputElement: HTMLInputElement | null;
        selected: SearchDropdownItem | null;
    } = $props();

    let debounceTimeout: ReturnType<typeof setTimeout>;
    const debounceDelay = 400;

    $effect(() => {
        clearTimeout(debounceTimeout);
        if (value.trim() !== "" ) {
            debounceTimeout = setTimeout(async () => {
                console.log("SearchDropDown is running the fetchFunction");
                loadingData = true;
                loadedData = await fetchFunction(value);

                console.log(loadedData);
                loadingData = false;
            }, debounceDelay);
        } else if (!selected) {
            loadedData = { data: null, error: null };
        }
    });

    onDestroy(() => {
        clearTimeout(debounceTimeout);
    });

    function selectItem(item: SearchDropdownItem) {
        console.log("TRIED TO SELECT ITEM", item);
        selected = item;
        inputElement?.blur();
        clearOptions();
    }

    function clearSelection() {
        selected = null;
        value = "";
        clearOptions();
        inputElement?.focus();
    }

    function clearOptions() {
        loadedData = { data: null, error: null };
        value = ""
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div
    class="bg-light-field-bg dark:bg-dark-field-bg rounded-t-lg pr-1 flex flex-col justify-start relative {className}"
>
    {#if selected}
        <!-- Selected state UI -->
        <div
            class="w-full h-full items-center bg-light-field-subbg dark:bg-dark-field-subbg border-light-field-accent dark:border-dark-field-accent border-2 rounded-t-md px-2 py-2 pr-1 flex gap-2"
        >
            {#if selected.id !== null}
                <img
                    src={imageAddressFunction(selected.id)}
                    alt="selected item"
                    class="h-8 w-auto rounded"
                />
            {/if}

            <div class="flex-1 flex flex-col justify-center min-w-0">
                <p class="font-medium text-sm truncate">{selected.text}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {selected.subtext}
                </p>
            </div>

            <div class="flex items-center gap-1">
                <button
                    class="flex items-center justify-center w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    onclick={clearSelection}
                    title="Clear selection"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    {:else}
        <!-- Search state UI -->
        <div
            class="w-full h-full items-center bg-light-field-bg dark:bg-dark-field-bg border-light-field-accent dark:border-dark-field-accent border-b-2 px-2 py-2 pr-1 flex gap-2"
        >
            <input
                type="text"
                {placeholder}
                bind:value
                bind:this={inputElement}
                class="w-full h-full outline-none grow bg-transparent"
                onblur={() => (loadedData = { data: null, error: null })}
            />
            <span class="duration-300 transition-transform block">
                <Search className={"block"} />
            </span>
        </div>

        {#if loadedData.data !== null}
            <div
                class="flex flex-col justify-start items-center w-full p-2 absolute right-0 top-full rounded-b-lg bg-light-field-bg dark:bg-dark-field-bg max-w-full gap-2 min-w-fit shadow-3xl z-50"
            >
                {#each loadedData.data as item}
                    <button
                        class="flex justify-start items-center w-full gap-2 p-2 rounded-md h-12 hover:bg-light-field-subbg hover:dark:bg-dark-field-subbg transition-colors"
                        onclick={() => selectItem(item)}
                    >
                        {#if item.id !== null}
                            <img
                                src={imageAddressFunction(item.id)}
                                alt="img"
                                class="h-full w-auto rounded"
                            />
                        {/if}
                        <div class="flex flex-col items-start min-w-0 flex-1">
                            <p class="font-medium text-sm truncate w-full">
                                {item.text}
                            </p>
                            <p
                                class="text-xs text-gray-600 dark:text-gray-400 truncate w-full"
                            >
                                {item.subtext}
                            </p>
                        </div>
                    </button>
                {/each}
            </div>
        {/if}
    {/if}
</div>

<script lang="ts">
    import type ComboBoxEntry from "$lib/core/types/comboBoxEntry";
    import { appState } from "$lib/core/util/appState";
    import { ChevronDown } from "@lucide/svelte";

    let showingItems: boolean = $state(false);

    let {
        items,
        currentItem = $bindable(null),
        value = $bindable(""),
        placeholder = "",
        className = "",
        inputElement = $bindable(null),
    }: {
        items: ComboBoxEntry[],
        currentItem: ComboBoxEntry | null,
        value: string
        placeholder: string,
        className: string,
        inputElement: HTMLInputElement | null
    } = $props();

    function handleBlur() {
        setTimeout(() => showingItems = false);
    }

    function selectItem(item: ComboBoxEntry) {
        currentItem = item;
        inputElement?.focus();
    }

    $appState.globalOnClick.concat(() => {
        showingItems = false;
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events  (the onclick event on the div is just there to ensure that the dropdown is closed, not to do any specific action. So it shouldn't be a button)-->
<div onclick={() => showingItems = false} class="bg-light-field-bg dark:bg-dark-field-bg rounded-lg {showingItems ?  'rounded-br-none' : ''} flex flex-col justify-start relative {className}">
    
    <div class="flex w-full h-full items-center">
        <input type="text" 
            placeholder={placeholder} 
            bind:value={value} 
            bind:this={inputElement}
            onblur={handleBlur}
            class="w-full h-full outline-none grow"
        >
        <button class="h-full" onclick={() => setTimeout(() => showingItems = true)}>
            <ChevronDown/>
        </button>
    </div>
    

    {#if showingItems}
        <div class="flex flex-col justify-start items-center p-2 absolute right-0 top-full rounded-b-lg bg-light-field-bg dark:bg-dark-field-bg max-w-full gap-2 w-48 min-w-fit">
            <p class="w-full text-sm">Search by</p>
            {#each items as item}
                <button class="flex justify-start items-center w-full gap-2 p-2 rounded-md {currentItem?.value === item.value ? 'bg-light-field-subbg dark:bg-dark-field-subbg' : ''}" onclick={() => selectItem(item)}>
                    {#if item.icon !== null}
                        <item.icon></item.icon>
                    {/if}
                    <p>{item.name}</p>
                </button>
            {/each}
        </div>
    {/if}
</div>
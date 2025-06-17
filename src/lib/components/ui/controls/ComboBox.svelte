<script lang="ts">
    import type ComboBoxEntry from "$lib/core/types/comboBoxEntry";
    import { ChevronDown, ChevronUp } from "@lucide/svelte";

    let {
        entries = [],
        currentEntry = $bindable(null),
        label = null,
        className = "",
    }:
    {
        className: string,
        entries: ComboBoxEntry[],
        currentEntry: ComboBoxEntry | null
        label: string | null
    } = $props();

    let open = $state(false);
</script>

<div class="relative min-w-32 z-20 {className}">
    {#if label !== null}
        <label id="open-label" for="open" class="absolute -top-3 bg-light-card-2 dark:bg-dark-card-2 rounded-t-md px-1 pr-1.5 text-sm text-light-fg-300 dark:text-dark-fg-300">
            {label}
        </label>
    {/if}
    <button
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="combo-list"
        aria-labelledby="open-label" 
        id="open"
        onclick={() => open = !open}
        class="flex justify-between items-center w-full h-10 px-2 transition-colors duration-300
            bg-light-field-bg dark:bg-dark-field-bg
            border-0
            {open ? 'rounded-t-lg border-b-0' : 'rounded-lg'}"
    >
        <span>{currentEntry?.name ?? "Select..."}</span>
        <ChevronDown class="transition-all duration-300 ease-out {open ? 'rotate-180' : ''}" />
    </button>

    {#if open}
        <div class="absolute top-full left-0 w-full z-10 
        pb-1
            bg-light-card-2 dark:bg-dark-card-2 
            border-x-0 border-b-0
            transition-all duration-300
            {open ? "" : ""}
            rounded-b-lg shadow-md overflow-hidden"
            id="combo-list"
            role="listbox"
            tabindex="-1"
        >
            <div class="w-full px-2 flex">
                <span class="w-full bg-light-field-accent dark:bg-dark-field-accent h-0.5 my-1 rounded-full"></span>
            </div>
            {#each entries as entry}
                <button
                    role="option"
                    aria-selected={entry === currentEntry}
                    class="px-1.5 py-1.5 pl-2
                    hover:bg-light-subaccent dark:hover:bg-dark-subaccent active:bg-light-subaccent dark:active:bg-dark-subaccent
                    cursor-pointer w-full text-start rounded-md"
                    onclick={() => {
                        currentEntry = entry;
                        open = false;
                    }}
                >
                    {entry.name}
                </button>
            {/each}
        </div>
    {/if}
</div>

<script lang="ts">
    import bezier from '$lib/core/util/bezier';
    import { Search, X } from '@lucide/svelte';
    import { fade } from 'svelte/transition';
    import TextField from './TextField.svelte';
    import { type SyncState } from '$lib/core/model/sync-state';
    import type { SearchDropdownItem } from '$lib/core/types/search-dropdown-item';
    
    let { placeholder = "option", className = "", selected = $bindable(null), fetchFunction = async (query: string) => ({data: null, error: null}), imageUrlFunction = (id: number) => ("url"), disabled = $bindable(false), searchOnKeydown = false, forceListUpdate = false, loading=$bindable(false), loadingMessage="Loading...", loadingControlledByComponent=false }: {
        placeholder: string,
        className?: string,
        selected: SearchDropdownItem | null,
        fetchFunction: (query: string) => Promise<SyncState<SearchDropdownItem[]>>,
        imageUrlFunction: (id: number) => string,
        disabled: boolean,
        searchOnKeydown: boolean,
        forceListUpdate: boolean,
        loading?: boolean,
        loadingMessage?: string,
        loadingControlledByComponent?: boolean

    } = $props();

    let containerRef = $state<HTMLDivElement | null>(null);
    let transformStyle = $state("");  
    let open = $state(false);
    let prevRect = $state<DOMRect | null>(null);
    
    function toggleOpen(s: null | SearchDropdownItem = null) {
        if (!open && containerRef) {
            prevRect = containerRef.getBoundingClientRect();
            transformStyle = `position: fixed; width: ${prevRect.width}px; height: ${prevRect.height}px; top: ${prevRect.top}px; left: ${prevRect.left}px`;
            setTimeout(() => {
                transformStyle = `position: fixed; max-width: 380px; width: 80dvw; height: auto; min-height: 40%; top: 50%; left: 50%; transform: translate(-50%, -50%);`
            }, 10);
        } else if (open) {
            if (prevRect) {
                transformStyle = `position: fixed; max-width: ${prevRect.width}px; width: ${prevRect.width}px; max-height: ${prevRect.height}px; top: ${prevRect.top}px; left: ${prevRect.left}px`;
                setTimeout(() => {
                    transformStyle = "position: relative";
                }, 300);
            } else {
                transformStyle = "position: relative";
            }
        }
        selected = s;
        open = !open;
    }

    let loadedEntries = $state<SyncState<SearchDropdownItem[]>>({data: null, error: null});
    let searchValue = $state("");

    async function loadEntries() {
        if (loadingControlledByComponent) loading = true;
        loadedEntries = await fetchFunction(searchValue);
        console.log("DATA: ", loadedEntries.data)
        if (loadingControlledByComponent) loading = false;
    }


    $effect(() => {
        if (forceListUpdate) loadEntries();
    })

    function selectItem(item: SearchDropdownItem) {
        toggleOpen(item);
    }

</script>

{#if open}
    <div onclick={() => toggleOpen(null)} class="fixed top-0 left-0 w-dvw h-dvh backdrop-blur-lg z-50" in:fade={{duration: 200, easing: bezier(.1, .9, .1, .9)}} out:fade={{duration: 300, easing: bezier(.15, .55, .3, .8)}}></div>
    <div class="h-10"></div>
{/if}

<!--this div will be the "display" when the modal opens (the base of the modal). So it should be a flex with dir set to column when open (and when closed, actually)-->
<div
    bind:this={containerRef}
    class="bg-light-field-bg dark:bg-dark-field-bg rounded-lg p-2 flex flex-col justify-start relative transition-all duration-300 ease-out {open ? 'z-60 shadow-xl' : ''} {className}"
    style="{transformStyle}"
>

    {#if selected === null}
        {#if !open}
            <button class="w-full h-full flex justify-between max-h-12 {disabled ? 'opacity-30 pointer-events-none' : ''}" onclick={() => toggleOpen(null)}>
                <span class="text-light-subaccent dark:text-dark-subaccent">Select a {placeholder}</span>
                <Search />
            </button>
        {:else}
            <TextField onKeyPress={() => {if (searchOnKeydown) loadEntries()}} placeholder="Search for a {placeholder}" noDecoration={true} icon={Search} bind:value={searchValue} onIconClick={loadEntries} onSubmit={loadEntries} ></TextField>
        {/if}
    {:else}
        <!--When there is an item selected, we can show the item here-->
        <button class="w-full h-full flex justify-start items-center gap-2 max-h-12" onclick={() => toggleOpen(null)}>
            <img class="max-w-12 aspect-square rounded-full" src={imageUrlFunction(selected.id)} alt="{placeholder}">
            <span class="text-light-fg-500 dark:text-dark-fg-500 text-lg">
                {placeholder}: {selected.text}
            </span>
            <div class="grow"></div>
            <X />
        </button>
    {/if}

    {#if open}
        {#if loading}
            <div class="m-auto">
                <span>{loadingMessage}<span>
            </div>
        {:else if loadedEntries.error !== null}
            <div class="m-auto">
                <span>An error ocurred: {loadedEntries.error.message}</span>
            </div>
        {:else}
            {#if !loadedEntries.data}
                <div class="m-auto">
                    <span>Make a search to select a {placeholder}.</span>
                </div>
            {:else if loadedEntries.data.length === 0}
                <div class="m-auto">
                    <span>No {placeholder} was found with your search.</span>
                </div>
            {:else}
                <div class="flex flex-col gap-2 py-1 px-0.5 justify-start items-center overflow-scroll max-h-120">
                    {#each loadedEntries.data as item}
                        <button class="w-full h-12 flex justify-start items-center p-2 bg-light-card-2 dark:bg-dark-card-2 rounded-md gap-2" onclick={() => selectItem(item)}>
                            <img class="h-full w-auto aspect-square rounded-full" src={imageUrlFunction(item.id)} alt="No image">
                            <div class="flex flex-col justify-center items-start overflow-hidden">
                                <span>
                                    {item.text}
                                </span>
                                <span class="text-sm truncate overflow-ellipsis w-full pr-2 max-w-full">
                                    {item.subtext}
                                </span>
                            </div>
                        </button>
                    {/each}
                </div>
            {/if}
        {/if}
    {/if}
</div>

<style>
</style>
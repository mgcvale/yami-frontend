<script lang="ts">
    import type TabControlEntry from "$lib/core/types/tab-control-entry";

    let {
        entries = [],
        currentEntry = $bindable(),
        className
    }: {
        entries: TabControlEntry[],
        currentEntry: TabControlEntry,
        className?: string
    } = $props();

    let tabElements: Record<string, HTMLButtonElement> = $state({});

    const sliderStyle = $derived(() => {
        const activeElement = tabElements[currentEntry?.value];

        if (!activeElement) {
            return 'width: 0px; transform: translateX(0px); opacity: 0;';
        }

        const left = activeElement.offsetLeft;
        const width = activeElement.offsetWidth;
        
        return `width: ${width}px; transform: translateX(${left}px); opacity: 1;`;
    });

</script>

<div class="relative flex justify-around items-center w-full h-fit {className ?? ''}">
    {#each entries as entry (entry.value)}
        <button 
            class="
                h-fit flex items-center gap-2 pb-2 px-4 transition-colors duration-300
                {entry.value === currentEntry.value ? 
                    'text-light-fg-300 dark:text-dark-fg-300' : 
                    'text-light-fg-900 dark:text-dark-fg-900'}
            " 
            onclick={() => currentEntry = entry}
            bind:this={tabElements[entry.value]}
        >
            <svelte:component this={entry.icon}></svelte:component>
            {entry.name}
        </button>
    {/each}

    <div 
        class="
            absolute left-0 bottom-0 h-0.5 
            bg-light-accent dark:bg-dark-accent 
            transition-all duration-300 ease-in-out
        " 
        style={sliderStyle()}
    ></div>
</div>
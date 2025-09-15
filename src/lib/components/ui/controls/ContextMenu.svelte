<script lang="ts">
    import type ContextMenuEntry from "$lib/core/types/context-menu-entry";
    import { appState } from "$lib/core/util/app-state";
    import bezier from "$lib/core/util/bezier";
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";

    let {
        entries = $bindable([]),
        className = "",
        showing = $bindable(false),
        header,
    }: {
        entries: ContextMenuEntry[];
        className?: string;
        showing: boolean;
        header?: string;
    } = $props();
    
    let contextMenu: HTMLElement | null = $state(null);

    onMount(() => { 
        $appState.globalOnClick.push(e => {
            showing = false;
        });
    });

</script>

<!-- svelte-ignore svelte_component_deprecated -->
{#if showing}
    <div
        out:scale={{
            duration: 300,
            opacity: 0,
            easing: bezier(0.47, -0.26, 0.34, 0.96),
        }}
        in:scale={{
            duration: 300,
            opacity: 0,
            easing: bezier(0.27, 0.37, 0.12, 1.19),
        }}
        class="absolute top-1/2 right-1/2 p-2 flex justify-start flex-col items-start rounded-lg bg-light-card-2 dark:bg-dark-card-2 min-w-max h-fit {className}"
        style="z-index: 999;"
        bind:this={contextMenu}
    >
        {#if header !== undefined}
            <p class="text-small w-full">{header}</p>
        {/if}
        {#each entries as entry}
            <button
                class="w-full rounded-md p-2 flex gap-4 justify-between items-center hover:bg-light-card-1 dark:hover:bg-dark-card-1"
                onclick={entry.action}
            >
                <h3>{entry.name}</h3>
                {#if entry.icon !== null}
                    <svelte:component this={entry.icon} size={20}
                    ></svelte:component>
                {/if}
            </button>
        {/each}
    </div>
{/if}

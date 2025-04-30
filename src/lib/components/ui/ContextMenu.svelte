<script lang="ts">
    import type ContextMenuEntry from "$lib/core/types/contextMenuEntry";
    import bezier from "$lib/core/util/bezier";
    import { cubicIn } from "svelte/easing";
    import { scale } from "svelte/transition";

    let { entries = $bindable([]), className = "", showing = $bindable(false) }: 
    { entries: ContextMenuEntry[], className?: string , showing: boolean} = $props();

    let contextMenu: HTMLElement | null = $state(null);

</script>

<!-- svelte-ignore svelte_component_deprecated -->
{#if showing}
<div out:scale={{duration: 300, opacity: 0, easing: bezier(.47,-0.26,.34,.96)}} in:scale={{duration: 300, opacity: 0, easing: bezier(.27,.37,.12,1.19)}} class="absolute z-50 top-1/2 right-1/2 p-2 flex justify-start flex-col items-start rounded-lg bg-light-card-2 dark:bg-dark-card-2 min-w-max h-fit {className}" bind:this={contextMenu}>
    {#each entries as entry}
        <button class="w-full rounded-md p-2 flex gap-4 justify-between items-center hover:bg-light-card-1 dark:hover:bg-dark-card-1" onclick={entry.action}>
            <h3>{entry.name}</h3>
            {#if entry.icon !== null}
                <svelte:component this={entry.icon} size={20}></svelte:component>
            {/if}
        </button>
    {/each}
</div>
{/if}
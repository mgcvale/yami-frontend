<script lang="ts">
    import type { Component } from "svelte";
    import { modalStore } from "$lib";
    import { scale, fade } from 'svelte/transition';

    let showing = $state(false);

    modalStore.subscribe((newModal: Component | null) => {
        showing = newModal !== null;
    });

</script>

<!-- svelte-ignore svelte_component_deprecated -->
{#if showing}
    <div transition:fade={{duration: 300}} class="fixed top-0 left-0 modal-container w-screen h-screen bg-black/25 backdrop-blur-xs flex justify-center">
        <div transition:scale={{duration: 300, opacity: 0}} class="modal m-auto max-w-[88dvw] max-h-fit bg-light-card-2 dark:bg-dark-card-1 rounded-xl p-2">
            <svelte:component this={$modalStore} />
        </div>
    </div>
{/if}

<style lang="scss">
    .modal-container {
        z-index: 99999;

        .modal {
            width: 440px;
        }
    }
</style>
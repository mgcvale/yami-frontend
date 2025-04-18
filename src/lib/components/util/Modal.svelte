<script lang="ts">
    import type { Component } from 'svelte';
    import { modalStore } from '$lib/core/store/modalStore';
    import { scale, fade } from 'svelte/transition';
  
    let showing = $state(false);
  
    modalStore.subscribe((newModal: { component: Component; props?: Record<string, any> } | null) => {
      showing = newModal !== null;
    });
  
    const clickedOutsideModal = (e: Event) => {
      if (e.target === e.currentTarget) {
        $modalStore = null;
      }
    };
  </script>
  
  <!-- svelte-ignore svelte_component_deprecated -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  {#if showing}
    <div
      onclick={clickedOutsideModal}
      transition:fade={{ duration: 300 }}
      class="fixed top-0 left-0 modal-container w-screen h-screen bg-black/25 backdrop-blur-xs flex justify-center -translate-y-3"
    >
      <div
        transition:scale={{ duration: 300, opacity: 0 }}
        class="modal m-auto max-w-[88dvw] max-h-fit bg-light-card-2 dark:bg-dark-card-1 rounded-xl p-2"
      >
        <svelte:component this={$modalStore?.component} {...($modalStore?.props ?? {})} />
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
<script lang="ts">
  import type { Component } from "svelte";
  import { scale, fade, slide } from "svelte/transition";
  import { snackbarStore } from "$lib/core/store/snackbarStore";

  let showing = $state(false);

  let showTimeout: ReturnType<typeof setTimeout> | null = null;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  snackbarStore.subscribe(
    (
      newSnackbar: { component: Component; props?: Record<string, any> } | null,
    ) => {
      console.log("Snackbar updated");
      if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }

      if (showing && newSnackbar !== null) {
        showing = false;
        showTimeout = setTimeout(() => {
          showing = true;
          hideTimeout = setTimeout(() => (showing = false), 4000);
        }, 100);
      } else if (newSnackbar !== null) {
        showing = true;
        hideTimeout = setTimeout(() => (showing = false), 4000);
      }
    }
  );


  const clickedOustideSnackbar = (e: Event) => {
    if (e.target === e.currentTarget) {
      $snackbarStore = null;
    }
  };
</script>

<!-- svelte-ignore svelte_component_deprecated -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if showing}
  <div
    onclick={clickedOustideSnackbar}
    transition:fade={{ duration: 300 }}
    class="top-0 left-0 w-dvw h-dvh modal-container fixed flex flex-col justify-end items-center text-center pointer-events-none"
  >
    <div
      transition:scale={{ duration: 300, opacity: 0 }}
      class="modal mx-auto mb-16 max-w-[88dvw] max-h-32 bg-light-card-1 dark:bg-dark-card-1 rounded-xl py-2 px-4 flex justify-center items-center drop-shadow-light-bg-hc dark:drop-shadow-dark-bg-hc"
    >
      <svelte:component
        this={$snackbarStore?.component}
        {...$snackbarStore?.props ?? {}}
      />
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-container {
    z-index: 98;

    .modal {
      box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
    }
  }
</style>

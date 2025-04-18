<script lang="ts">
    import { modalStore } from "$lib/core/store/modalStore";
    import { X } from "@lucide/svelte";
    import Button from "./Button.svelte";

    let { title, message } = $props();
</script>

<div class="flex flex-col justify-between items-center p-2 w-fit relative">
    <h2 class="font-alegreya text-2.5xl font-medium text-light-fg-300 dark:text-dark-fg-500 text-center w-fit">
        {title}
    </h2>
    <h4 class="font-dm-sans text-[0.95rem] text-center p-3 py-6 pb-8">
        {@html message}
    </h4>
    <div class="flex justify-end items-center w-full gap-3">
        <Button onclick={() => $modalStore = null} accent={true} className="w-1/2 text-light-card-1 dark:text-dark-card-1">
            Ok
        </Button>
    </div>

    <button class="cursor-pointer absolute top-1.5 right-1.5" onclick={() => $modalStore = null}>
        <X />
    </button>
</div>
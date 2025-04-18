<script lang="ts">
    import { goto } from "$app/navigation";
    import { modalStore } from "$lib/core/store/modalStore";
    import { X } from "@lucide/svelte";

    let { actionName = "view your homepage" } = $props();

    const gotoLogin = () => {
        goto("/account/login");
        $modalStore = null;
    }

    const gotoRegister = () => {
        goto("/account/register");
        $modalStore = null;
    }
    
</script>

<div class="flex flex-col justify-between items-center p-2 w-fit relative">
    <h2 class="font-alegreya text-2.5xl font-medium text-light-fg-300 dark:text-dark-fg-500 text-center w-fit">
        You aren't logged in!
    </h2>
    <h4 class="font-dm-sans text-[0.95rem] text-center p-3 py-6 pb-8">
        To {actionName}, you must be logged in or craete a new account.
    </h4>
    <div class="flex flex-col justify-between items-center w-full gap-3">
        <button onclick={gotoRegister} class="cursor-pointer w-full border-light-fg-900 dark:border-dark-fg-900 rounded-[8px] text-xs py-1 border-2 text-light-fg-500 dark:text-dark-fg-700">Create an account</button>
        <button onclick={gotoLogin} class="cursor-pointer w-full bg-light-placeholder dark:bg-dark-placeholder rounded-[8px] text-xs py-1.5 text-light-fg-hc dark:text-dark-fg-hc">I have an account - login</button>
    </div>

    <button class="cursor-pointer absolute top-1.5 right-1.5" onclick={() => $modalStore = null}>
        <X />
    </button>
</div>
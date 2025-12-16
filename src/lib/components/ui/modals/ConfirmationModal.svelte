<script lang="ts">
    import { X } from "@lucide/svelte";
    import Button from "../controls/Button.svelte";
    import { modalStore } from "$lib/core/store/modalStore";

    let {
        actionName,
        action
    }: {
        actionName: string,
        action: (confirmed: boolean) => void 
    } = $props();

    function confirm(confirmed: boolean) {
        action(confirmed);
        modalStore.set(null);
    }
</script>

<div class="p-4 relative">
    <X class="absolute top-3 right-3 cursor-pointer" onclick={() => confirm(false)} />

    <h1 class="font-alegreya text-xl pb-2">Confirmação para {actionName}</h1>
    <p class="text-sm pb-4">Tem certeza que quer {actionName.toLowerCase()}?</p>

    <div class="flex justify-end gap-3">
        <Button onclick={() => confirm(false)} className="px-4">Cancelar</Button>
        <Button accent={true} onclick={() => confirm(true)} className="px-4">Confirmar</Button>
    </div>
</div>

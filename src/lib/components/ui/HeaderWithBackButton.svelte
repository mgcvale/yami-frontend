<script lang="ts">
    import { ChevronLeft } from "@lucide/svelte";
import PageTitle from "./controls/PageTitle.svelte";

    let {
        title=""
    }: {
        title: string 
    } = $props();
</script>

<div class="flex justify-start items-center gap-2 p-2">
    <ChevronLeft size={32} class="cursor-pointer" onclick={() => window.history.back()}></ChevronLeft>
    <PageTitle className="p-2! pl-0!">{title}</PageTitle>
</div>

<script lang="ts">

    let { className = "" }: {
        className: string,
    } = $props();

</script>

<div class="flex flex-col justify-start items-start p-4 gap-2 {className}">
    <h1 class="font-alegreya text-3xl">Your feed</h1>
</div>
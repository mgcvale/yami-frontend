<script lang="ts">
    let { lineClassName = "", containerClassName = "" } = $props();
</script>
<div class="w-full {containerClassName}">
    <div class="w-full h-[2px] {lineClassName}"></div>
</div>
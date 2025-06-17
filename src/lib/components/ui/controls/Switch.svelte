<script lang="ts">
	let { enabled = $bindable(true) }: { enabled: boolean } = $props();
</script>

<button
	aria-label="Switch"
	onclick={() => enabled = !enabled}
	class="w-12 h-7 rounded-full p-1 bg-light-card-2 dark:bg-dark-card-2 border-2 border-light-accent dark:border-dark-accent relative"
>
    <div 
    class="absolute top-1 left-1 h-4 aspect-square rounded-full bg-light-accent dark:bg-dark-accent transition-[left] duration-200 [transition-timing-function:cubic-bezier(.17,.03,0,1))]"
    style="left: {enabled ? '0.25rem' : '1.5rem'}"
    ></div>

</button>

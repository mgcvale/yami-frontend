<script lang="ts">
    let { placeholder = "", icon = $bindable(null), value = $bindable(""), className = "", noDecoration = false, password = $bindable(false), onIconClick=() => {}, errorMessage = $bindable(""), textarea = false, maxLength = null, rows = 3 } = $props();
</script>

<div class="flex flex-col gap-1 justify-center items-start {className}">
<div class={[
        "bg-light-field-bg dark:bg-dark-field-bg border-light-field-accent dark:border-dark-field-accent w-full relative",
        {"border-b-2 rounded-t-md p-2 flex gap-2": !noDecoration, "border-0 rounded-md flex gap-2 py-1.5 px-3": noDecoration},
        {"!border-light-error dark:!border-dark-error border-1": errorMessage !== ""},
        {"pb-6": maxLength && textarea}
        ]}
>
    {#if textarea}
        <textarea class="w-full border-none outline-none resize-y overflow-auto" placeholder="{placeholder}" bind:value={value} maxlength={maxLength ? maxLength : 9999} rows={rows}></textarea>
        {#if maxLength}
            <span class="absolute bottom-2 right-2 w-fit h-fit text-sm">
                {value.length} / {maxLength}
            </span>
        {/if}
    {:else}
        <input type={password ? "password" : "text"} class="w-full border-none outline-none" placeholder="{placeholder}" bind:value={value} maxlength={maxLength ? maxLength : 9999}>
    {/if}

    {#if icon !== null}
        <svelte:component onclick={() => onIconClick()} this={icon}></svelte:component>
    {/if}

</div>
{#if errorMessage !== ""}
    <p class="pl-1 text-light-error dark:text-dark-error text-xs">{errorMessage}</p>
{/if}
</div>
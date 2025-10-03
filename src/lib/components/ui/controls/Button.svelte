<script lang="ts">
    let { children, className = "", outline = false, accent = false, onclick = () => {}, disabled = $bindable(false) } = $props(); 
</script>

<button class="
    {outline ? 
        accent ?
            "border-light-fg-50 dark:border-dark-fg-500 bg-transparent" 
        : 
            "border-light-button-accent dark:border-dark-button-accent bg-transparent"
    :
        accent ?
            "bg-light-fg-50 dark:bg-dark-fg-500/80 border-none text-light-card-2 dark:text-dark-card-1"
        :
            "bg-light-card-3 dark:bg-dark-card-3 border-none dark:text-fg-700"
    }    
    border-2 rounded-md p-1 cursor-pointer {disabled ? 'opacity-30' : ''} {className}
"
    {disabled}
    onclick={() => onclick()}    
>
    {@render children()}
</button>
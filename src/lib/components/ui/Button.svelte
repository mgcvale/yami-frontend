<script lang="ts">
    let { children, className = "", outline = false, accent = false, onclick = () => {} } = $props();
</script>

<button class="
    {outline ? 
        accent ?
            "border-light-fg-50 dark:border-dark-fg-500 bg-transparent" 
        : 
            "border-light-button-accent dark:border-dark-button-accent bg-transparent"
    :
        accent ?
            "bg-light-fg-50 dark:bg-dark-fg-500/80 border-none"
        :
            "bg-light-button-accent dark:bg-dark-accent border-none"
    }    
    border-2 rounded-md p-1 cursor-pointer {className}
"
    onclick={() => onclick()}    
>
    {@render children()}
</button>
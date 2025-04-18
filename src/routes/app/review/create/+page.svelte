<script lang="ts">
    import { currentUserStore, LoginAsker, modalStore } from "$lib";
    import { onMount } from "svelte";
    
    onMount(() => {
        if ($currentUserStore == null) {
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "create a review"
                }
            });
        }
    });
</script>
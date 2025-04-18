<script lang="ts">
    import { page } from "$app/state";   
    import { currentUserStore, LoginAsker, modalStore } from "$lib";
    import { onMount } from "svelte";

    let userid: string = $state("self");
    
    onMount(() => {
        userid = page.url.searchParams.get('id') ?? 'self';
        if ($currentUserStore === null && userid === 'self') {
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "view your profile"
                }
            });
        }
    });
    
</script>
<a href="/">go back</a>  
<p>User ID: {page.url.searchParams.get('id')} </p>
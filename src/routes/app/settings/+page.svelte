<script lang="ts">
    import { currentUserStore, modalStore, type CurrentUser } from "$lib";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import { onMount } from "svelte";

    function load(currentuser: AsyncState<CurrentUser>) {
        if (currentuser.loading) return;
        if (currentuser.data !== null) return;

        modalStore.set({
            component: LoginAsker,
            props: {
                actionName: "change your settings"
            }
        });
    }

    currentUserStore.subscribe(newUser => {
        load(newUser);
    });

    onMount(() => {
        load($currentUserStore);
    })

</script>

<div class="p-3">
    <h1 class="font-alegreya text-2.5xl mb-5">Yami settings</h1>
    <p class="text-light-fg-700 dark:text-dark-fg-500">These settings are synced acrross your account.</p>
</div>
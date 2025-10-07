<script lang="ts">
    import type { CurrentUser } from "$lib/core/model/current-user";
    import { X } from "@lucide/svelte";
    import Button from "../controls/Button.svelte";
    import PageTitle from "../controls/PageTitle.svelte";
    import TextField from "../controls/TextField.svelte";
    import { modalStore } from "$lib/core/store/modalStore";
    import { updateAccount } from "$lib/core/actions/account/update-account";
    import { goto, refreshAll } from "$app/navigation";
    import type { SyncState } from "$lib/core/model/sync-state";

    let { user }: { user: CurrentUser } = $props();

    let username: string = $state(user.username);
    let bio: string = $state(user.bio);
    let location: string = $state(user.location);

    let buttonDisabled = $state(true);

    let usernameErrorMessage = $state("");
    let errorMessage = $state("");

    $effect(() => {
        if (username != user.username) {
            buttonDisabled = false;
        } else if (bio != user.bio) {
            buttonDisabled = false;
        } else if (location != user.location) {
            buttonDisabled = false;
        } else {
            buttonDisabled = true;
        }
    });

    $effect(() => {
        username;
        usernameErrorMessage = "";
    })

    async function updateInfo() {
        const res: SyncState<null> = await updateAccount(username, bio, location);
        if (res.error !== null) {
            if (res.error.status === 409) {
                usernameErrorMessage = "This username is already in use!";
            } else {
                errorMessage = res.error.message;
            }
        } else {
            modalStore.set(null);
            refreshAll();
        }
    }

</script>

<X class="absolute cursor-pointer top-4 right-4" onclick={() => modalStore.set(null)} />

<div class="flex justify-between px-2 py-1 pb-4">
    <PageTitle className=" p-0!">Edit your profile</PageTitle>
</div>
<div class="flex flex-col gap-4">

    <div class="flex flex-col">
        <span class="pl-1">Your username</span>
        <TextField placeholder="username" errorMessage={usernameErrorMessage} noDecoration={true} bind:value={username}></TextField>
    </div>

    <div class="flex flex-col">
        <span class="pl-1">Your bio</span>
        <TextField noDecoration={true} placeholder="bio" bind:value={bio}></TextField>
    </div>

    <div class="flex flex-col pb-2">
        <span class="pl-1">Your location</span>
        <TextField noDecoration={true} placeholder="location" bind:value={location}></TextField>
    </div>

    {#if errorMessage && errorMessage !== ""}
        <span class="text-light-error dark:text-dark-error text-center pb-2">Error: {errorMessage}</span>
    {/if}
    <Button accent={true} bind:disabled={buttonDisabled} onclick={updateInfo}>Update info</Button>
</div>
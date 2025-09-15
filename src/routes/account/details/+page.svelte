<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/controls/Button.svelte";
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import Modal from "$lib/components/util/Modal.svelte";
    import { finishAccount, validateInputs } from "$lib/core/actions/account/finish-account";
    import type { SyncState } from "$lib/core/model/sync-state";

    let bio = $state("");
    let bioError = $state("");
    let location = $state("");
    let locationError = $state("");

    async function finishAccountClick() {
        let valid: boolean = false;
        [bioError, locationError, valid] = validateInputs(bio, location);
        if (!valid) return;
        
        const res: SyncState<null> = await finishAccount(bio, location);
        if (res.error !== null) {
            return;
        }
        goto('/app');
    }

</script>

<Card1>
    <header class="flex flex-col align-center justify-center h-14">
        <Logo className="w-full h-auto" />
    </header>

    <div class="flex flex-col gap-1 items-center mt-4 mb-1">
        <h2 class="font-alegreya text-2xl pb-0 mb-0">
            Tell us more about you
        </h2>
        <h4 class="text-md text-light-fg-700 dark:text-dark-fg-700 text-center pb-5">
            You can also leave the fields empty, if you prefer
        </h4>

        <TextField
            placeholder="Location"
            className="w-80 max-w-full pb-2" noDecoration={true}
            bind:value={location}
            bind:errorMessage={locationError}
        ></TextField>

        <TextField
            placeholder="Your Bio"
            className="w-80 max-w-full pb-3" noDecoration={true}
            textarea={true}
            maxLength=128
            bind:value={bio}
            bind:errorMessage={bioError}
        ></TextField>

        <Button accent={true} className="text-light-card-1 dark:text-dark-card-1 w-80 max-w-full" onclick={finishAccountClick}>
            Ok
        </Button>

    </div>
</Card1>

<Modal />
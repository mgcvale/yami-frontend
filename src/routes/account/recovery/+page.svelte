<script lang="ts">
    import Button from "$lib/components/ui/controls/Button.svelte";
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import Modal from "$lib/components/util/Modal.svelte";
    import { Eye, EyeOff } from "@lucide/svelte";
    import { goto } from "$app/navigation";
    import { recoverPassword } from "$lib/core/actions/account/recover-password";

    let { data }: { data: {token: string, username: string} } = $props();

    let password = $state("");
    let passwordErrorMessage = $state("");
    let confirmPassword = $state("");
    let confirmPasswordErrorMessage = $state("");

    let updatePasswordErrorMessage = $state("");
    let passwordHide = $state(true);
    let passwordIcon = $derived(passwordHide ? EyeOff : Eye);

    let loading = $state(false);
    let success = $state(false);

    const onPasswordIconClick = () => {
        passwordHide = !passwordHide;
    }

    async function updatePasswordClick() {
        loading = true;
        updatePasswordErrorMessage = "";
        if (password.length < 8) {
            confirmPasswordErrorMessage = "";
            passwordErrorMessage = "The password must be at least 8 characters.";
            loading = false;
            return;
        }
        if (password != confirmPassword) {
            passwordErrorMessage = "";
            confirmPasswordErrorMessage = "The passwords don't match.";
            loading = false;
            return;
        }

        confirmPasswordErrorMessage = "";
        passwordErrorMessage = "";

        const res = await recoverPassword(data.token, password);

        if (res.error !== null) {
            updatePasswordErrorMessage = res.error.message;
            loading = false;
            return;
        }

        updatePasswordErrorMessage = "";

        success = true;
        loading = false;
    }
    
</script>

<Card1>
    <header class="flex flex-col align-center justify-center h-14">
        <Logo className="w-full h-auto" />
    </header>

    <div class="flex flex-col gap-4 items-center mt-4 mb-1">
        <h2 class="font-alegreya text-2xl pb-3">
            Password Recovery
        </h2>

        {#if !success}
            <p class="px-3 text-center w-full">Hi, {data.username}! To recover your account, type your new password below.</p>
            
            <TextField placeholder={"Password"} className="w-80 max-w-full" bind:value={password} noDecoration={true} bind:password={passwordHide} bind:icon={passwordIcon} onIconClick={onPasswordIconClick} bind:errorMessage={passwordErrorMessage} />
            <TextField placeholder={"Confirm Password"} className="w-80 max-w-full" bind:value={confirmPassword} noDecoration={true} bind:password={passwordHide} bind:icon={passwordIcon} onIconClick={onPasswordIconClick} bind:errorMessage={confirmPasswordErrorMessage} />
            {#if updatePasswordErrorMessage}
                <p class="text-light-error dark:text-dark-error text-sm text-center">{updatePasswordErrorMessage}</p>
            {/if}
            <Button accent={true} className="text-light-card-1 dark:text-dark-card-1 w-80 max-w-full" onclick={updatePasswordClick} bind:loading={loading}>
                Update Password
            </Button>
        {:else}
            <p class="px-3 text-center w-full">Your password has been updated successfully!</p>
            <p class="px-3 text-center w-full">You can now <a href="/account/login" class="underline text-light-fg-100 dark:text-dark-fg-100">Login</a>.</p>
        {/if}
    </div>
</Card1>

<Card1 className="flex flex-col items-center justify-center gap-4">
    <div class="items-center text-center">
        <p>Have your password?</p>
        <a href="/account/login" class="underline text-light-fg-100 dark:text-dark-fg-100">Login</a>
    </div>
</Card1>

<Modal />
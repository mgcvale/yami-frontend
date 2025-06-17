<script lang="ts">
    import { currentUserStore, modalStore } from "$lib";
    import Button from "$lib/components/ui/controls/Button.svelte";
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import Modal from "$lib/components/util/Modal.svelte";
    import { Eye, EyeOff } from "@lucide/svelte";
    import { login, loginResponse, validateInputs } from "$lib/core/actions/account/login";
    import { writable, type Writable } from "svelte/store";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import { HandleAllGeneric } from "$lib/core/actions/genericErrorHandler";

    let usernameOrEmail = $state("");
    let usernameOrEmailErrorMessage = $state("");
    let password = $state("");
    let passwordErrorMessage = $state("");

    let loginErrorMessage = $state("");
    let passwordHide = $state(true);
    let passwordIcon = $derived(passwordHide ? EyeOff : Eye);

    const onPasswordIconClick = () => {
        passwordHide = !passwordHide;
    }

    function loginClick() {
        let valid: boolean;
        [usernameOrEmailErrorMessage, passwordErrorMessage, valid] = validateInputs(usernameOrEmail, password);
        if (!valid) return;

        login(usernameOrEmail, password);
    }

    loginResponse.subscribe(newResponse => {
        if (newResponse.loading) return;
        loginErrorMessage = "";

        if (newResponse.error !== null) {
            if (newResponse.error.status === 401) {
                loginErrorMessage = "Your username or password are incorrect.";
                return;
            } else {
                HandleAllGeneric(newResponse.error);
            }
        }
    });
    
</script>

<Card1>
    <header class="flex flex-col align-center justify-center h-14">
        <Logo className="w-full h-auto" />
    </header>

    <div class="flex flex-col gap-4 items-center mt-4 mb-1">
        <h2 class="font-alegreya text-2xl pb-3">
            Welcome back!
        </h2>
        
        <TextField placeholder={"Username or Email"} className="w-80 max-w-full" bind:value={usernameOrEmail} noDecoration={true} bind:errorMessage={usernameOrEmailErrorMessage} />
        <TextField placeholder={"Password"} className="w-80 max-w-full" bind:value={password} noDecoration={true} bind:password={passwordHide} bind:icon={passwordIcon} onIconClick={onPasswordIconClick} bind:errorMessage={passwordErrorMessage} />
        {#if loginErrorMessage}
            <p class="text-light-error dark:text-dark-error text-sm text-center">{loginErrorMessage}</p>
        {/if}
        <Button accent={true} className="text-light-card-1 dark:text-dark-card-1 w-80 max-w-full" onclick={loginClick}>
            Log in
        </Button>
    </div>
</Card1>

<Card1 className="flex flex-col items-center justify-center">
    <p>Don't have an account?</p>
    <a href="/account/register" class="underline text-light-fg-100 dark:text-dark-fg-100">Register instead</a>
</Card1>

<Modal />



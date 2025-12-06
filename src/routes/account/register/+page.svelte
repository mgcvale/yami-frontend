<script lang="ts">
    import Button from "$lib/components/ui/controls/Button.svelte";
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import Modal from "$lib/components/util/Modal.svelte";
    import { Eye, EyeOff } from "@lucide/svelte";
    import { createAccount, validateInputs } from "$lib/core/actions/account/create-account";

    let username = $state("");
    let usernameErrorMessage = $state("");
    let email = $state("");
    let emailErrorMessage = $state("");
    let password = $state("");
    let passwordErrorMessage = $state("");

    let passwordHide = $state(true);
    let passwordIcon = $derived(passwordHide ? EyeOff : Eye);

    let loading = $state(false);

    const onPasswordIconClick = () => {
        passwordHide = !passwordHide;
    }

    async function createAccountClick() {
        loading = true;
        let valid: boolean;
        [usernameErrorMessage, emailErrorMessage, passwordErrorMessage, valid] = validateInputs(username, email, password);
        if (!valid) return;

        [usernameErrorMessage, emailErrorMessage, passwordErrorMessage] = await createAccount(username, email, password);
        loading = false;
    }
    
</script>

<Card1>
    <header class="flex flex-col align-center justify-center h-14">
        <Logo className="w-full h-auto" />
    </header>

    <div class="flex flex-col gap-4 items-center mt-4 mb-1">
        <h2 class="font-alegreya text-2xl">
            Create an account
        </h2>
        
        <TextField placeholder={"Username"} maxLength={31} className="w-80 max-w-full" bind:value={username} noDecoration=true bind:errorMessage={usernameErrorMessage} />
        <TextField placeholder={"Email"} className="w-80 max-w-full" bind:value={email} noDecoration=true bind:errorMessage={emailErrorMessage} />
        <TextField placeholder={"Password"} className="w-80 max-w-full" bind:value={password} noDecoration=true bind:password={passwordHide} bind:icon={passwordIcon} onIconClick={onPasswordIconClick} bind:errorMessage={passwordErrorMessage} />
        <Button accent={true} className="text-light-card-1 dark:text-dark-card-1 w-80 max-w-full" onclick={createAccountClick} bind:loading={loading}>
            Create account
        </Button>
    </div>
</Card1>

<Card1 className="flex flex-col items-center justify-center gap-4">
    <div class="items-center text-center">
        <p>Already have an account?</p>
        <a href="/account/login" class="underline text-light-fg-100 dark:text-dark-fg-100">Log-in instead</a>
    </div>

    <div class="items-center text-center">
        <p>Don't want to log in?</p>
        <a href="/app" class="underline text-light-fg-100 dark:text-dark-fg-100">Return to yami</a>
    </div>
</Card1>
<Modal />



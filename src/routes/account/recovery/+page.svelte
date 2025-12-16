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
            Recuperação de senha
        </h2>

        {#if !success}
            <p class="px-3 text-center w-full">Olá, {data.username}! Para recuperar sua conta, insira sua nova senha abaixo.</p>
            
            <TextField placeholder={"Password"} className="w-80 max-w-full" bind:value={password} noDecoration={true} bind:password={passwordHide} bind:icon={passwordIcon} onIconClick={onPasswordIconClick} bind:errorMessage={passwordErrorMessage} />
            <TextField placeholder={"Confirm Password"} className="w-80 max-w-full" bind:value={confirmPassword} noDecoration={true} bind:password={passwordHide} bind:icon={passwordIcon} onIconClick={onPasswordIconClick} bind:errorMessage={confirmPasswordErrorMessage} />
            {#if updatePasswordErrorMessage}
                <p class="text-light-error dark:text-dark-error text-sm text-center">{updatePasswordErrorMessage}</p>
            {/if}
            <Button accent={true} className="text-light-card-1 dark:text-dark-card-1 w-80 max-w-full" onclick={updatePasswordClick} bind:loading={loading}>
                Atualizar senha
            </Button>
        {:else}
            <p class="px-3 text-center w-full">Sua senha foi atualizada com sucesso!</p>
            <p class="px-3 text-center w-full">Você pode agora <a href="/account/login" class="underline text-light-fg-100 dark:text-dark-fg-100">fazer log-in</a>.</p>
        {/if}
    </div>
</Card1>

<Card1 className="flex flex-col items-center justify-center gap-4">
    <div class="items-center text-center">
        <p>Tem sua senha?</p>
        <a href="/account/login" class="underline text-light-fg-100 dark:text-dark-fg-100">Fazer log-in</a>
    </div>
</Card1>

<Modal />
<script lang="ts">
    import Button from "$lib/components/ui/controls/Button.svelte";
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import Modal from "$lib/components/util/Modal.svelte";
    import { requestPasswordReset } from "$lib/core/actions/account/request-password-reset";
    import type { SyncState } from "$lib/core/model/sync-state";

    let email: string = $state("");
    let emailErrorMessage: string = $state("");
    let requestErrorMessage: string = $state("");
    let loading: boolean = $state(false);
    let success: boolean = $state(false);
    
    async function requestClick() {
        loading = true;
        if (email.trim().length === 0) {
            emailErrorMessage = "Please enter a valid email."
            loading = false;
            return;
        }
        const res: SyncState<null> = await requestPasswordReset(email);

        emailErrorMessage = "";
        requestErrorMessage = "";
        
        if (res.error !== null) {
            requestErrorMessage = res.error.message;
        } else {
            success = true;
        }

        loading = false;
    }
    
</script>

<Card1>
    <header class="flex flex-col align-center justify-center h-14">
        <Logo className="w-full h-auto" />
    </header>

    <div class="flex flex-col gap-4 items-center mt-4 mb-1">
        <h2 class="font-alegreya text-2xl pb-3">
            Recuperação de conta
        </h2>
        {#if !success}
            <p>Para recuperar sua conta, informe-nos seu e-mail.</p>
            
            <TextField placeholder={"email"} className="w-80 max-w-full" bind:value={email} noDecoration={true} bind:errorMessage={emailErrorMessage} />
            {#if requestErrorMessage}
                <p class="text-light-error dark:text-dark-error text-sm text-center">{requestErrorMessage}</p>
            {/if}
            <Button accent={true} className="text-light-card-1 dark:text-dark-card-1 w-80 max-w-full" onclick={requestClick} bind:loading={loading}>
                Enviar e-mail de recuperação
            </Button>
        {:else}
            <p class="px-3 text-center w-full">E-mail de recuperação enviado. Veja sua inbox e siga as instruções.</p>
            <p class="px-3 text-center w-full">Não recebeu um e-mail? Tente <button class="border-none bg-transparent underline text-light-fg-100 dark:text-dark-fg-100" onclick={() => success=false}>fazer outra requisição</button>.</p>
        {/if}
    </div>
</Card1>

<Card1 className="flex flex-col items-center justify-center gap-4">
    <div class="items-center text-center">
        <p>Não tem uma conta?</p>
        <a href="/account/register" class="underline text-light-fg-100 dark:text-dark-fg-100">Crie sua conta</a>
    </div>

    <div class="items-center text-center">
        <p>Tem sua senha?</p>
        <a href="/account/login" class="underline text-light-fg-100 dark:text-dark-fg-100">Fazer log-in</a>
    </div>
</Card1>

<Modal />
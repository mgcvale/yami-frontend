<script lang="ts">
    import { follow, unfollow } from "$lib/core/actions/account/follow-account";
    import type { PublicUser } from "$lib/core/model/public-user";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { currentUserStore } from "$lib/core/store/currentUserStore";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import Button from "./controls/Button.svelte";
    import EntityStatsHeader from "./EntityStatsHeader.svelte";
    import ErrorSnackbar from "./ErrorSnackbar.svelte";
    import { onMount } from "svelte";

    let { user = $bindable(), viewingSelf = false, onFollowerClick, onFollowingClick, onEditClick }: {
        user: PublicUser,
        viewingSelf: boolean,
        onEditClick: (e: Event) => void,
        onFollowerClick?: (e: Event) => void,
        onFollowingClick?: (e: Event) => void
    } = $props();

    let followerCount = $state(user.followerCount);
    let following = $state(user.following);

    function syncLocalVariables() {
        user.followerCount += user.following ? 1 : -1;
        followerCount = user.followerCount;
        following = user.following
    }

    onMount(() => {
        console.log("USER ON UserHeader.svelte: ", user);
        console.log("CURRENTUSER ON UserHeader.svelte: ", $currentUserStore.data);
    })

    let isFollowLoading = $state<boolean>(false);

    async function onFollowClick() {
        console.log("Clicked user");
        if ($currentUserStore.data === null) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: `Você deve estar logado para seguir um usuário.`
                }
            });
            return;
        }

        if (user.id === $currentUserStore.data?.id) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: "Você não pode seguir você mesmo(a)."
                }
            });
            return;
        }

        // using optimistic update
        console.log("updated");
        user.following = !user.following;
        syncLocalVariables();
        isFollowLoading = true;

        console.log("calling api");
        const result: SyncState<null> = !user.following 
            ? await unfollow(user.id)
            : await follow(user.id);

        console.log(result);
        if (result.error !== null) {
            console.log("Error");
            // revert update on error
            user.following = !user.following;
            syncLocalVariables();
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: `Ocorreu um erro: ${result.error.message}`
                }
            });
        }
        
        isFollowLoading = false;
    }

</script>

{#if user}
<EntityStatsHeader
    className='h-24'
    name={user.username}
    headers={[
        {
            name: "Avaliações",
            nameClassName: "text-ml",
            count: user.reviewCount,
            countClassName: "text-lg text-light-fg-hc dark:text-dark-fg-hc",
        },
        {
            name: "Seguidores",
            nameClassName: "text-light-fg-900 dark:text-dark-fg-900 text-sm",
            count: followerCount,
            countClassName: "text-light-fg-700 dark:text-dark-fg-700 text-md",
            onClick: onFollowerClick
        },
        {
            name: "Seguindo",
            nameClassName: "text-light-fg-900 dark:text-dark-fg-900 text-sm",
            count: user.followingCount,
            countClassName: "text-light-fg-700 dark:text-dark-fg-700 text-md",
            onClick: onFollowingClick
        },
    ]}
    pictureUrl={"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
/>

<div class="flex flex-col justify-start items-start text-start mx-2">
    <h2 class="text-light-fg-50 dark:text-dark-fg-50 text-xl font-bold font-alegreya mx-1">
        @{user.username}
    </h2>
    <h4 class="text-md font-dm-sans text-light-fg-500 dark:text-dark-fg-500 text-ms mx-1">
        {user.bio}
        {#if user.location !== null && user.location.trim() !== ""}
            <span class="text-sm text-light-fg-700 dark:text-dark-fg-700">• De <span>{user.location}</span></span>
        {/if}
    </h4>
    {#if viewingSelf}
        <Button onclick={onEditClick} accent={false} outline={false} className="w-full rounded-ml py-0.5 mt-2">
            Editar perfil
        </Button>
    {:else}
        <Button onclick={onFollowClick} accent={following} outline={following} className="w-full rounded-ml py-0.5 mt-2">
            {following ? "Parar de seguir" : "Seguir"}
        </Button>
    {/if}
</div>
{/if}
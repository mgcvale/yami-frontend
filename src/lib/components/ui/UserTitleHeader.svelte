<script lang="ts">
    import { follow, unfollow } from "$lib/core/actions/account/follow-account";
    import { type PublicUser } from "$lib/core/model/public-user";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { currentUserStore } from "$lib/core/store/currentUserStore";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import Button from "./controls/Button.svelte";
    import ErrorSnackbar from "./ErrorSnackbar.svelte";

    let isFollowLoading = $state<boolean>(false);

    async function onFollowClick() {
        console.log("Clicked user");
        if ($currentUserStore.data === null) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: `You must be logged in to follow a user`
                }
            });
            return;
        }

        if (user.id === $currentUserStore.data?.id) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: "You can't follow yourself"
                }
            });
            return;
        }

        // using optimistic update
        console.log("updated");
        user.following = !user.following;
        localFollowing = user.following;
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
            localFollowing = user.following;
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: `An error occurred: ${result.error.message}`
                }
            });
        }
        
        isFollowLoading = false;
    }

    let { 
        user=$bindable<PublicUser>(),
        className="", 
        name="", 
        nameClassName="", 
        bio="", 
        bioClassName="", 
        location="", 
        locationClassName="", 
        editable=false, 
        onEditClick = () => {}, 
    }: {
        user: PublicUser
        className: string,
        name: string,
        nameClassName?: string,
        bio: string,
        bioClassName?: string,
        location: string,
        locationClassName?: string,
        editable: boolean,
        onEditClick: () => void,
    } = $props();

    let localFollowing = $state<boolean>(user.following);
</script>

<div class="flex flex-col justify-start items-start text-start {className}">
    <h2 class="text-light-fg-50 dark:text-dark-fg-50 text-xl font-bold font-alegreya mx-1 {nameClassName}">
        @{name}
    </h2>
    <h4 class="text-md font-dm-sans text-light-fg-500 dark:text-dark-fg-500 text-ms mx-1 {bioClassName}">
        {bio}
        {#if location !== null && location.trim() !== ""}
            <span class="text-sm text-light-fg-700 dark:text-dark-fg-700">• From <span class="{locationClassName}">{location}</span></span>
        {/if}
    </h4>
    {#if editable}
        <Button onclick={onEditClick} accent={false} outline={false} className="w-full rounded-ml py-0.5 mt-2">
            Edit profile
        </Button>
    {:else}
        <Button onclick={onFollowClick} accent={localFollowing} outline={localFollowing} className="w-full rounded-ml py-0.5 mt-2">
            {localFollowing ? "Unfollow" : "Follow"}
        </Button>
    {/if}
    

</div>
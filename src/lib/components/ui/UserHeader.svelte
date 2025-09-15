<script lang="ts">
import { follow, unfollow } from "$lib/core/actions/account/follow-account";
import type { PublicUser } from "$lib/core/model/public-user";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { snackbarStore } from "$lib/core/store/snackbarStore";
import EntityStatsHeader from "./EntityStatsHeader.svelte";
import UserTitleHeader from "./UserTitleHeader.svelte";
import ErrorSnackbar from "./ErrorSnackbar.svelte";
    import type { SyncState } from "$lib/core/model/sync-state";

let { user = $bindable(), viewingSelf = false }: {
    user: PublicUser | null,
    viewingSelf: boolean,
} = $props();

let isFollowLoading = $state(false);

async function onFollowClick() {
    if ($currentUserStore.loading) {
        snackbarStore.set({
            component: ErrorSnackbar,
            props: {
                warningMessage: "We are still loading your account, try again later."
            }
        });
        return;
    }

    if (!$currentUserStore.loading && $currentUserStore.data === null) {
        snackbarStore.set({
            component: ErrorSnackbar,
            props: {
                warningMessage: `You must be logged in to follow a user`
            }
        });
        return;
    }

    if (!user || user.id === $currentUserStore.data?.id) {
        snackbarStore.set({
            component: ErrorSnackbar,
            props: {
                warningMessage: "You can't follow yourself"
            }
        });
        return;
    }

    // using optimistic update
    const wasFollowing = user.following;
    user.following = !wasFollowing;
    isFollowLoading = true;

    const result: SyncState<null> = wasFollowing 
        ? await unfollow(user.id)
        : await follow(user.id);

    if (result.error !== null) {
        // revert update on error
        user.following = wasFollowing;
        snackbarStore.set({
            component: ErrorSnackbar,
            props: {
                warningMessage: `An error occurred: ${result.error.message}`
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
            name: "Reviews",
            nameClassName: "text-ml",
            count: user.reviewCount,
            countClassName: "text-lg text-light-fg-hc dark:text-dark-fg-hc",
        },
        {
            name: "Followers",
            nameClassName: "text-light-fg-900 dark:text-dark-fg-900 text-sm",
            count: user.followerCount,
            countClassName: "text-light-fg-700 dark:text-dark-fg-700 text-md",
        },
        {
            name: "Following",
            nameClassName: "text-light-fg-900 dark:text-dark-fg-900 text-sm",
            count: user.followingCount,
            countClassName: "text-light-fg-700 dark:text-dark-fg-700 text-md"
        },
    ]}
    pictureUrl={"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
/>
<UserTitleHeader
    name={user.username}
    bio={user.bio}
    location={user.location}
    className="mx-2"
    bind:following={user.following}
    editable={viewingSelf}
    onFollowClick={onFollowClick}
    onEditClick={() => console.log("clicked edit")}
/>
{/if}
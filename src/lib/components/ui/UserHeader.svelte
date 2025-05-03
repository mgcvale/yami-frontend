<script lang="ts">
    import { follow, followAccountStore, unfollow } from "$lib/core/actions/account/followAccount";
    import type PublicUser from "$lib/core/model/publicUser";
    import { currentUserStore } from "$lib/core/store/currentUserStore";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import EntityStatsHeader from "./EntityStatsHeader.svelte";
    import EntityTitleHeader from "./EntityTitleHeader.svelte";
    import ErrorSnackbar from "./ErrorSnackbar.svelte";

    let { user = $bindable(), viewingSelf = false }: {
        user: PublicUser | null,
        viewingSelf: boolean,
    } = $props();

    function onFollowClick() {
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
                    warningMessage: `You must be logged in to ${user?.following ? "follow" : "unfollow"} a user`
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

        if (user.following) {
            unfollow(user.id);
            user.following = false;
        } else {
            follow(user.id);
            user.following = true;
        }
    }

    followAccountStore.subscribe(change => {
        if (change.loading || !user) return;
        if (change.error !== null) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: `An error occurred: ${change.error.status}`
                }
            });
            user.following = !user.following;
            return;
        }
    });
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
    <EntityTitleHeader 
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
<script lang="ts">
    import config from "$lib/config";
    import EntityStatsHeader from "./EntityStatsHeader.svelte";
    import type { Restaurant } from "$lib/core/model/restaurant";
    import Button from "./controls/Button.svelte";
    import { follow, unfollow } from "$lib/core/actions/restaurant/follow-restaurant";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import ErrorSnackbar from "./ErrorSnackbar.svelte";

    let { data }: {data: Restaurant} = $props();

    let following = $derived(data.following);
    let followerCount = $derived(data.followerCount);
    let loading = false;

    async function onFollowClick() {
        if (loading) return;

        loading = true;
        if (!following) {
            doFollow();
        } else {
            doUnfollow();
        }

        loading = false;
    }

    async function doFollow() {
        following = true;
        followerCount++;
        const res = await follow(data.id);
        if (res.error !== null) {
            if (res.error.status === 409) {
                // this means we already followed it somehow, which means we can just pretend we didn't before.
                // we will just update the count correctly.
                followerCount = data.followerCount + (data.following ? 0 : 1); // if we were not following and now we are, we add 1 to the count.
                return; 
            }
            following = false;
            followerCount--;
            showError(res.error, "seguir");
        }
    }

    async function doUnfollow() {
        following = false;
        followerCount--;
        const res = await unfollow(data.id);
        if (res.error !== null) {
            following = true;
            followerCount++;
            showError(res.error, "parar de seguir");
        }
    }


    function showError(error: App.Error, action: string) {
        snackbarStore.set({
            component: ErrorSnackbar,
            props: {
                warningMessage: `Não foi possivel ${action}: ${error.message}`
            }
        });
    }

</script>

<EntityStatsHeader 
    className='h-24'
    name={data.name}
    pictureUrl={config.apiPaths.restaurantImage(data.id)}
    headers={[
        {
            name: "Reviews",
            nameClassName: "text-ml",
            count: data.reviewCount,
            countClassName: "text-lg"
        },
        {
            name: "Foods",
            nameClassName: "text-ml",
            count: data.foodCount,
            countClassName: "text-lg"
        },
        {
            name: "Followers",
            nameClassName: "text-md pt-1",
            count: followerCount,
            countClassName: "text-md"
        }
    ]}
/>
<div class="flex flex-col justify-start items-start text-start">
    <h2 class="text-light-fg-50 dark:text-dark-fg-50 text-xl font-bold font-alegreya mx-1">
        @{data.shortName}
    </h2>
    <h4 class="text-md font-dm-sans text-light-fg-300 dark:text-dark-fg-300 text-ms mx-1">
        {data.name}
        {#if data.location !== undefined && data.location.trim() !== ""}
            <span class="text-sm text-light-fg-700 dark:text-dark-fg-700">• From <span>{data.location}</span></span>
        {/if}
    </h4>
    <h4 class="text-md font-dm-sans text-light-fg-500 dark:text-dark-fg-500 text-ms mx-1">
        {data.description}
    </h4>

    <Button onclick={onFollowClick} accent={following} outline={following} className="w-full rounded-ml py-0.5 mt-2">
        {following ? "Parar de seguir" : "Seguir"}
    </Button>
</div>
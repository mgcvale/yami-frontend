<script lang="ts">
    import { page } from "$app/state";   
    import { currentUserStore, LoginAsker, modalStore, type CurrentUser, type PublicUser } from "$lib";
    import RatingStats from "$lib/components/ui/RatingStats.svelte";
    import UserHeader from "$lib/components/ui/UserHeader.svelte";
    import { loadPublicAccountStore, loadPublicUser } from "$lib/core/actions/account/loadPublicAccount";
    import { loadUserStats, loadUserStatsStore } from "$lib/core/actions/account/loadUserStats";
    import type ReviewStats from "$lib/core/model/reviewStats";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import { onMount } from "svelte";

    let isPageViewable: boolean = $state(true);
    let viewingSelf: boolean = $state(false);
    let thisUser: AsyncState<PublicUser> = $state({
        data: null,
        loading: true,
        error: null,
    });
    let thisUserStats: AsyncState<ReviewStats> = $state({
        data: null,
        loading: true,
        error: null,
    });
    let user: PublicUser | null = $state(null);

    function load(currentUser: AsyncState<CurrentUser>) {
        if (currentUser.loading) {
            console.log("REFUSED TO LOAD: current user wasn't yet loaded");
            return;
        }
        if (thisUser.data !== null && thisUser.data.id === currentUser.data?.id) return;
        const searchParamsUserId = page.url.searchParams.get("id");

        if (currentUser.data !== null) {
            if (searchParamsUserId === null || searchParamsUserId === currentUser.data.id.toString()) {
                thisUser = currentUser;
                user = currentUser.data; // Update reactive user
                loadUserStats(currentUser.data.id);
                viewingSelf = true;
                return;
            }
            console.log("calling API");
            loadPublicUser(parseInt(searchParamsUserId));
            loadUserStats(parseInt(searchParamsUserId));
            return;
        }

        if (searchParamsUserId !== null) {
            console.log("calling API");
            loadPublicUser(parseInt(searchParamsUserId));
            loadUserStats(parseInt(searchParamsUserId));
        } else {
            thisUser = {
                loading: false,
                data: null,
                error: null
            };
            thisUserStats = {
                loading: false,
                data: null,
                error: {
                    status: 401,
                    json: {}
                }
            };
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "view your profile"
                }
            });                
            isPageViewable = false;
        }
    }

    onMount(() => {
        load($currentUserStore);

        loadPublicAccountStore.subscribe(newPublicAccount => {
            thisUser = newPublicAccount;
            user = newPublicAccount.data;
        });

        currentUserStore.subscribe(newStore => {
            console.log("reloading due to logged in user change: ", newStore.loading);
            load(newStore);
        });

        loadUserStatsStore.subscribe(newStore => {
            thisUserStats = newStore;
        });
    });
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
    {#if thisUser.loading}
        <h2 class="w-full text-center text-xl">Loading...</h2>
    {:else}
        {#if !isPageViewable}
            <p>You must be logged in to view this page.</p>
        {:else if thisUser.data === null}
            {#if thisUser.error !== null}
                <h2 class="text-xl text-light-error dark:text-dark-error w-full text-center">An error occurred!</h2>
                {#if thisUser.error.status === 404}
                    <p>The user you requested wasn't found.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if thisUser.error.status === 500}
                    <p>An error occurred on our end. You can try again later.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if thisUser.error instanceof TypeError}
                    <p>A network error occurred. Check if you're connected to the internet</p>
                {:else}
                    <p>An unknown error occurred.</p>
                    <p>Error status: {thisUser.error.status}</p>
                {/if}
            {:else}
                <h2 class="text-xl font-alegreya">An unknown error occurred!</h2>
            {/if}
        {:else}
            <UserHeader bind:user={user} viewingSelf={viewingSelf} />
            <RatingStats className={"p-2"} name={user?.username ?? ''} bind:stats={thisUserStats} />
        {/if}
    {/if}
</div>